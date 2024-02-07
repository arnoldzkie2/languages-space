import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { CLIENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === CLIENT) {

            const client = await prisma.client.findUnique({
                where: { id: session.user.id }, select: {
                    orders: {
                        select: {
                            id: true,
                            name: true,
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

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only allow admin to proceed

        const clientID = getSearchParams(req, 'clientID')
        if (!clientID) return notFoundRes(CLIENT)

        const client = await prisma.client.findUnique({
            where: {
                id: clientID
            },
            select: {
                orders: {
                    include: {
                        client: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        })
        if(!client) return notFoundRes(CLIENT)

        return okayRes(client.orders)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}