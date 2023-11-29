import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, serverErrorRes } from "@/utils/apiResponse";
import { NextResponse } from "next/server";

interface FormData {
    department: string
    username: string
    password: string
}

export const POST = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')
    const { username, password }: FormData = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { username } }) ||
            await prisma.superAdmin.findUnique({ where: { username } }) ||
            await prisma.admin.findUnique({ where: { username } }) ||
            await prisma.supplier.findUnique({ where: { username } }) ||
            await prisma.agent.findUnique({ where: { username } })
        if (existingUsername) return NextResponse.json({ msg: 'Username already exist' }, { status: 409 })

        if (department) {

            const checkDepartment = await prisma.department.findUnique({ where: { name: department.toLowerCase() } })
            if (!checkDepartment) return notFoundRes('Department')

            const newClient = await prisma.client.create({
                data: {
                    username, password, departments: {
                        connect: { id: checkDepartment.id }
                    }
                }
            })
            if (!newClient) return badRequestRes()

            return createdRes()
        }

        const newClient = await prisma.client.create({
            data: {
                username, password
            }
        })
        if (!newClient) return badRequestRes()

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}