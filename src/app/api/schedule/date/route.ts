import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const supplierID = searchParams.get('supplierID')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    try {

        if (fromDate && toDate && supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: {
                    schedule: {
                        where: {
                            date: {
                                gte: fromDate,
                                lte: toDate
                            },
                        },
                    }
                }
            });

            if (!supplier) return badRequestRes()

            return okayRes(supplier.schedule)

        }

        return notFoundRes('supplierID')

    } catch (error) {
        console.error('Error fetching schedules:', error);
        return serverErrorRes(error)
    }

}