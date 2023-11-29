import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { username, password }: { username: string, password: string } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { username } }) ||
            await prisma.superAdmin.findUnique({ where: { username } }) ||
            await prisma.admin.findUnique({ where: { username } }) ||
            await prisma.supplier.findUnique({ where: { username } }) ||
            await prisma.agent.findUnique({ where: { username } })
        if (existingUsername) return NextResponse.json({ msg: 'Username already exist' }, { status: 409 })

        const createSuperAdmin = await prisma.superAdmin.create({ data: { username, password } })
        if (!createSuperAdmin) badRequestRes()

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const superAdminID = searchParams.get('superAdminID')

    try {

        if (superAdminID) {

            const superAdmin = await prisma.superAdmin.findUnique({ where: { id: superAdminID } })
            if (!superAdmin) return notFoundRes('Super admin')

            return okayRes(superAdmin)

        }

        const allSuperAmin = await prisma.superAdmin.findMany()
        if (!allSuperAmin) return badRequestRes()

        return okayRes(allSuperAmin)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const superAdminID = searchParams.get('superAdminID')

    try {

        if (superAdminID) {

            const superAdmin = await prisma.superAdmin.findUnique({ where: { id: superAdminID } })
            if (!superAdmin) return notFoundRes("Super admin")

            const deletedSuperAdmin = await prisma.superAdmin.delete({ where: { id: superAdminID } })
            if (!deletedSuperAdmin) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('superAdminID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}