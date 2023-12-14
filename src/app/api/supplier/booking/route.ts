import prisma from "@/lib/db";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const supplierID = getSearchParams(req, 'supplierID')

    try {

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: {
                    bookings: {
                        select: {
                            id: true,
                            schedule: {
                                select: {
                                    date: true,
                                    time: true
                                },
                            },
                            supplier: {
                                select: {
                                    name: true
                                }
                            },
                            card_name: true,
                            status: true,
                            note: true,
                            created_at: true
                        },
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!supplier) return notFoundRes('Client')

            return okayRes(supplier.bookings)

        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
