import prisma from "@/lib/db";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const clientID = getSearchParams(req, 'clientID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({
                where: { id: clientID }, select: {
                    orders: {
                        select: {
                            id: true,
                            card: {
                                select: {
                                    name: true
                                }
                            },
                            price: true,
                            created_at: true,
                            quantity: true,
                            status: true
                        },
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!client) return badRequestRes()

            return okayRes(client.orders)
        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}