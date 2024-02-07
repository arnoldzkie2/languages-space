import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const bookingID = getSearchParams(req, 'bookingID')

    try {

        const session = await getAuth()
        if (!session || session.user.type !== 'supplier') return unauthorizedRes()

        if (bookingID) {

            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                include: {
                    supplier: {
                        select: {
                            name: true
                        }
                    }, schedule: {
                        select: {
                            date: true,
                            time: true
                        }
                    }, client: {
                        select: {
                            username: true,
                            name: true
                        }
                    },
                    course: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            if (!booking) return notFoundRes('Booking')

            return okayRes(booking)
        }

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
                        client: {
                            select: {
                                username: true
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
        if (!supplier) return notFoundRes('Supplier')

        return okayRes(supplier.bookings)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
