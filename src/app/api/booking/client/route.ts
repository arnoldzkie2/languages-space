import prisma from "@/lib/db";
import { notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientID = searchParams.get('clientID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID }, select: { bookings: true } })
            if (!client) return notFoundRes('Client')

            return okayRes(client.bookings)
        }

        return notFoundRes('clientID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}