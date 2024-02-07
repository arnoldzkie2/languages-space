import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { getAuth } from "@/lib/nextAuth";
import { checkIsAdmin } from "@/utils/checkUser";

export const POST = async (req: NextRequest) => {

    const { name }: { name: string } = await req.json()
    const departmentName = name.toLowerCase()

    try {
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const existingDepartment = await prisma.department.findUnique({ where: { name: departmentName } })
        if (existingDepartment) return existRes('department')

        const newDepartment = await prisma.department.create({ data: { name: departmentName } })
        if (!newDepartment) return badRequestRes()

        return createdRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const GET = async (req: NextRequest) => {

    const departmentID = getSearchParams(req, 'departmentID')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        if (departmentID) {

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) return notFoundRes('Department')

            return okayRes(department)
        }

        const departments = await prisma.department.findMany()
        if (!departments) return badRequestRes()

        return okayRes(departments)

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const PATCH = async (req: NextRequest) => {

    const departmentID = getSearchParams(req, 'departmentID')
    const { name } = await req.json()
    const departmentName = name.toLowerCase()

    try {


        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        if (!departmentID) return notFoundRes("Department")

        //retrieve department
        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) notFoundRes('Department')
        //return 404 reposnse if not exist

        //check for existing department
        const existingDepartment = await prisma.department.findUnique({ where: { name: departmentName } })
        if (existingDepartment) return existRes("Department")
        //return 409 reponse if department name already exist

        //update department
        const updateDepartment = await prisma.department.update({ where: { id: departmentID }, data: { name: departmentName } })
        if (!updateDepartment) badRequestRes()
        //return 400 reponse if it fails


        //return 200 response
        return okayRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: NextRequest) => {

    const departmentID = getSearchParams(req, 'departmentID')
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //return 404 response if department not passed
        if (!departmentID) return notFoundRes("Department")

        //retrieve department
        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        const deleteDepartment = await prisma.department.delete({ where: { id: departmentID } })
        if (!deleteDepartment) badRequestRes()

        return okayRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}