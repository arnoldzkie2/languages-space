import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { user_name, password } = await req.json()

    try {

        const checkUsername = await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } })
        if (checkUsername) existRes('user_name')

        const newSuperAdmin = await prisma.superAdmin.create({ data: { user_name, password } })
        if (!newSuperAdmin) badRequestRes()

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