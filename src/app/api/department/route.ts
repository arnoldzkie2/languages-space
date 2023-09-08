import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { name } = await req.json()

    try {

        const existingDepartment = await prisma.department.findFirst({ where: { name } })

        if (existingDepartment) return existRes('department')

        const newDepartment = await prisma.department.create({ data: { name } })

        if (!newDepartment) return badRequestRes()

        return createdRes()

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const departmentID = searchParams.get('departmentID')

    try {

        const singleDepartment = await prisma.department.findUnique({ where: { id: String(departmentID) } })

        if (singleDepartment) okayRes(singleDepartment)

        if (departmentID && !singleDepartment) return notFoundRes('Department')

        const allDepartment = await prisma.department.findMany()

        if (!allDepartment) return badRequestRes()

        return okayRes(allDepartment)

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const departmentID = searchParams.get('departmentID')

    const { name } = await req.json()

    try {

        if (departmentID) {

            const singleDepartment = await prisma.department.findUnique({ where: { id: departmentID } })

            if (!singleDepartment) notFoundRes('Department')

            const updatedDepartment = await prisma.department.update({ where: { id: departmentID }, data: { name } })

            if (!updatedDepartment) badRequestRes()

            return okayRes()

        }

        return notFoundRes('departmentID')

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const departmentID = searchParams.get('departmentID')

    try {

        if (departmentID) {

            const checkDepartment = await prisma.department.findUnique({ where: { id: departmentID } })

            if (!checkDepartment) return notFoundRes('Department')

            const deletedDepartment = await prisma.department.delete({ where: { id: departmentID } })

            if (!deletedDepartment) badRequestRes()

            return okayRes()
        }

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}