import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin, checkUsername } from "@/utils/checkUser";
import { ADMIN } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only admisn are allowed to enter here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const adminID = getSearchParams(req, 'adminID')
        const departmentID = getSearchParams(req, 'departmentID')

        //if adminID provided get the admin
        if (adminID) {
            const admin = await prisma.admin.findUnique({ where: { id: adminID }, include: { departments: true } })
            if (!admin) return notFoundRes("Admin")
            //return 404 response if not found

            return okayRes(admin)
            //return the admin
        }

        //if departmentID provided return all admin in that department
        if (departmentID) {
            const department = await prisma.department.findUnique({
                where: { id: departmentID },
                include: {
                    admins: {
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!department) return notFoundRes("Department")
            //return 404 response if department not fouind

            return okayRes(department.admins)
        }

        //return all admins
        const allAdmin = await prisma.admin.findMany({
            orderBy: {
                created_at: 'desc'
            }
        })
        if (!allAdmin) return badRequestRes("Failed to get all admins")

        //return 200 response
        return okayRes(allAdmin)

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


export const POST = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get the requst body
        const { name, username, password, email, note,
            departments, organization, origin, phone_number,
            address, gender, profile_key, profile_url } = await req.json()

        //check if one of this not found return 404 response
        if (!name || !username || !password) return notFoundRes("Missing Inputs")

        const existingUsername = await checkUsername(username)
        if (existingUsername) return existRes("Username")

        //create admin
        const createAdmin = await prisma.admin.create({
            data: { name, email, password, username, note, organization, origin, phone_number, address, gender, profile_key, profile_url }
        })
        if (!createAdmin) return badRequestRes("Failed to create admin")
        //return 400 response if it fails to create

        if (departments && departments.length > 0) {
            const checkDepartments = await prisma.department.findMany({
                where: {
                    id: {
                        in: departments
                    }
                }
            })
            //check all existing departments
            const existingDepartmentIds = checkDepartments.map(department => department.id);
            const nonExistingDepartmentIds = departments.filter((id: string) => !existingDepartmentIds.includes(id));
            //check if some department does not exist in database
            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 404 });

            //update the admin and connect all departments
            const updateAdminDepartment = await prisma.admin.update({
                where: { id: createAdmin.id }, data: {
                    departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }
            })
            //return 400 response if it fails to connect
            if (!updateAdminDepartment) return badRequestRes("Failed to connect department to admin")
        }

        //return 201 response
        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get the requst body
        const adminID = getSearchParams(req, 'adminID')
        const { name, username, password, email, note, departments,
            organization, origin, phone_number, address, gender, profile_key, profile_url } = await req.json()

        //check if one of this not found return 404 response
        if (!name || !username || !password || !adminID) return notFoundRes("Missing Inputs")

        const admin = await prisma.admin.findUnique({ where: { id: adminID }, include: { departments: true } })
        if (!admin) return notFoundRes(ADMIN)
        //return 404 respone if admin not found

        if (admin.username !== username && username) {
            //if admin username changed check if the new username already exist in all users
            const existingUsername = await checkUsername(username)
            if (existingUsername) return existRes("Username")
        }

        //update admin
        const updateAdmin = await prisma.admin.update({
            where: { id: admin.id },
            data: { name, email, password, username, note, organization, origin, phone_number, address, gender, profile_key, profile_url }
        })
        if (!updateAdmin) return badRequestRes("Failed to update admin")
        //return 400 response if it fails to update


        if (departments && departments.length > 0) {

            const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));
            //update admin Department
            const departmentsToRemove = admin.departments.filter((department) =>
                !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
            )

            const updateAgentDepartment = await prisma.admin.update({
                where: { id: admin.id },
                data: {
                    departments: {
                        connect: departmentsToConnect,
                        disconnect: departmentsToRemove
                    },
                }
            })
            if (!updateAgentDepartment) return badRequestRes("Failed to update admin")
            //return 400 response if it fails to update

        }

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { searchParams } = new URL(req.url);
        const adminIDS = searchParams.getAll('adminID');
        //get all adminID

        if (adminIDS.length > 0) {

            const deleteAdmin = await prisma.admin.deleteMany({
                where: { id: { in: adminIDS } },
            })
            if (!deleteAdmin) return badRequestRes("Failed to delete Admin")
            //return 400 response if it fails to delete
            if (deleteAdmin.count < 1) return notFoundRes(ADMIN)

            //return 200 response
            return okayRes()
        }

        //return 404 response if adminID not passed
        return notFoundRes(ADMIN)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect();
    }
}
