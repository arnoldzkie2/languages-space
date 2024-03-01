import { checkBookingAndUpdateStatus } from "@/lib/api/updateBookingStatus";
import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { CLIENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow client
        if (session.user.type !== CLIENT) return unauthorizedRes()

        await checkBookingAndUpdateStatus()

        //retrieve client bookings
        const client = await prisma.client.findUnique({
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
                                name: true,
                                profile_url: true,
                                gender: true,
                            }
                        },
                        client: {
                            select: {
                                username: true,
                                profile_url: true
                            }
                        },
                        card_name: true,
                        status: true,
                        note: true,
                        client_comment: true,
                        supplier_comment: true,
                        created_at: true
                    },
                    orderBy: { created_at: 'desc' }
                }
            }
        })
        if (!client) return notFoundRes('Client')

        //modify the booking

        const modifyBookings = client.bookings.map(booking => ({
            ...booking,
            client_comment: booking.client_comment.length > 0 ? true : false,
            supplier_comment: booking.supplier_comment.length > 0 ? true : false
        }))

        return okayRes(modifyBookings)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

