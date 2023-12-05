import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";

export const GET = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (session.user.type !== 'client') return badRequestRes()

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
                    }
                }
            }
        })
        if (!client) return badRequestRes()

        return okayRes(client.orders)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }

}