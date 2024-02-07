import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { CLIENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type !== CLIENT) return unauthorizedRes()

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

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

