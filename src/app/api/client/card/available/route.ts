import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";

export const GET = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'client') {
            const availableCards = await prisma.clientCardList.findMany({
                where: { available: true, supported_courses: { some: {} }, supported_suppliers: { some: {} } }, select: {
                    id: true,
                    name: true,
                    price: true,
                    balance: true,
                    validity: true,
                    supported_courses: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    supported_suppliers: {
                        select: {
                            supplier: {
                                select: {
                                    name: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            })
            if (!availableCards) return badRequestRes()

            return okayRes(availableCards)

        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }
}