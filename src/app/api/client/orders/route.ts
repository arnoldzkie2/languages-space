import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'client') {

            const client = await prisma.client.findUnique({
                where: { id: session.user.id }, select: {
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

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}