import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import axios from "axios";

export const POST = async (req: Request) => {


    const { name }: { name: string } = await req.json()

    const departmentName = name.toLowerCase()

    try {

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

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const departmentID = searchParams.get('departmentID')
    const { name } = await req.json()
    const departmentName = name.toLowerCase()

    try {

        if (departmentID) {

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) notFoundRes('Department')

            const updateDepartment = await prisma.department.update({ where: { id: departmentID }, data: { name: departmentName } })
            if (!updateDepartment) badRequestRes()

            return okayRes()

        }
        return notFoundRes('departmentID')

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const departmentID = searchParams.get('departmentID')
    try {
        if (departmentID) {

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) return notFoundRes('Department')

            const deleteDepartment = await prisma.department.delete({ where: { id: departmentID } })
            if (!deleteDepartment) badRequestRes()

            return okayRes()
        }

        return notFoundRes('Department')

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}