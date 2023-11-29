import prisma from "@/lib/db";
import { notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')

    try {

        if (supplierID) {

            const supplier = await prisma.client.findUnique({ where: { id: supplierID }, select: { bookings: true } })
            if (!supplier) return notFoundRes('Client')

            return okayRes(supplier.bookings)
        }

        return notFoundRes('supplierID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}