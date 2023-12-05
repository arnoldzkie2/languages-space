import prisma from "@/lib/db";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const clientID = getSearchParams(req, 'clientID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({
                where: { id: clientID }, select: {
                    bookings: {
                        select: {
                            id: true,
                            schedule: {
                                select: {
                                    date: true,
                                    time: true
                                }
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
            if (!client) return notFoundRes('Client')

            return okayRes(client.bookings)

        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
