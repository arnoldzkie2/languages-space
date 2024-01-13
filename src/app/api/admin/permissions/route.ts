import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { ADMIN, DEPARTMENT } from "@/utils/constants";
import { AdminPermission } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only admin are allowed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //retrieve adminID and departmentID in search parameters
        const adminID = getSearchParams(req, 'adminID')
        const departmentID = getSearchParams(req, 'departmentID')

        //return 400 respone if one of this not exist
        if (!adminID || !departmentID) return notFoundRes("Missing Inputs")

        //retrieve adminPermission
        const admin = await prisma.admin.findUnique({
            where: { id: adminID },
            include: {
                department_permission: {
                    where: {
                        departmentID
                    },
                    include: {
                        admin_permissions: true
                    }
                }
            }
        });

        if (!admin || !admin.department_permission?.[0]?.admin_permissions?.length) {
            return NextResponse.json({ msg: "Admin does not have permission in this department" }, { status: 404 });
        }
        //return 400 respone if it fails

        const permissions = admin.department_permission[0].admin_permissions[0]
        //return 200 response and pass the adminPermission hover to see what's inside
        return okayRes(permissions)

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
        //only admin are allowed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get the departmentID in requst body
        const { departmentID, adminID } = await req.json()

        //check if it exist
        if (!departmentID) return notFoundRes(DEPARTMENT)
        if (!adminID) return notFoundRes(ADMIN)

        //retrieve the department
        const [department, admin] = await Promise.all([
            prisma.department.findUnique({ where: { id: departmentID } }),
            prisma.admin.findUnique({ where: { id: adminID } })
        ])
        if (!department) return notFoundRes(DEPARTMENT)
        if (!admin) return notFoundRes(ADMIN)
        //return 404 respone if department not found

        //create permission to admin in this department
        const createAdminPermissionToDepartment = await prisma.departmentPermission.create({
            data: {
                admin: { connect: { id: admin.id } },
                department: { connect: { id: department.id } },
                admin_permissions: {
                    create: {}
                }
            }, include: {
                admin_permissions: true
            }
        })
        if (!createAdminPermissionToDepartment) return badRequestRes("Failed to create admin permission to department")
        //return 400 respone if it fails

        //return 201 response
        return createdRes(createAdminPermissionToDepartment)

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only admin are allowed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get the permission data in request body
        const body: AdminPermission = await req.json()
        if (!body) return badRequestRes()

        //get the admin permission
        const adminPermission = await prisma.adminPermission.findUnique({ where: { id: body.id } })
        if (!adminPermission) return notFoundRes("Admin Permission")
        //return 404 response if it fails

        const updateAdminPermission = await prisma.adminPermission.update({
            where: { id: adminPermission.id }, data: body
        })
        if (!updateAdminPermission) return badRequestRes("Failed to update admin permission")

        return okayRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only admin are allowed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        ///get the adminpermissionID in searchParameters
        const adminPermissionID = getSearchParams(req, 'adminPermissionID')
        if (!adminPermissionID) return notFoundRes("Admin Permission")
        //return 404 if does not exist

        //retrieve the permission
        const adminPermission = await prisma.adminPermission.findUnique({ where: { id: adminPermissionID } })
        if (!adminPermission) return notFoundRes("Admin Permission")
        //return 404 if permissin not exist

        //delete the permission

        const deleteDepartmentPermission = await prisma.departmentPermission.delete({ where: { id: adminPermission.departmentPermissionID } })
        if (!deleteDepartmentPermission) return badRequestRes("Failed to delete agent department permission")
        //return 400 respone if it fails

        //return 200 response
        return okayRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}