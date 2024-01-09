import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const supplierID = getSearchParams(req, 'supplierID')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {

            const supplier = await prisma.supplier.findUnique({
                where: { id: session.user.id },
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

        if (!supplierID) return notFoundRes('Supplier')
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

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

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
