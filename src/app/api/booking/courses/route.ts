import prisma from "@/lib/db";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {

    const clientCardID = getSearchParams(req, 'clientCardID')

    try {
        if (clientCardID) {
            const card = await prisma.clientCard.findUnique({
                where: { id: clientCardID }, select: {
                    card: {
                        select: {
                            supported_courses: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            })
            if (!card) return notFoundRes('Card')

            return okayRes(card.card.supported_courses)
        }

        return notFoundRes('Card')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

