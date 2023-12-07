import prisma from "@/lib/db";
import { badRequestRes, getSearchParams, notFoundRes, okayRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const departmentID = getSearchParams(req, 'departmentID')
    const clientID = getSearchParams(req, 'clientID')

    //get all client card
    if (clientID) {
        const client = await prisma.client.findUnique({
            where: { id: clientID },
            select: {
                cards: {
                    select: {
                        id: true,
                        name: true,
                        balance: true
                    }
                }
            }
        })
        if (!client) return notFoundRes('Client')

        return okayRes(client.cards)
    }

    // get all client that has cards in specific department
    if (departmentID) {

        const clientsWithCards = await prisma.client.findMany({
            where: {
                cards: { some: {} },
                departments: { some: { id: departmentID } }
            },
            select: {
                id: true,
                username: true
            }
        })
        if (!clientsWithCards) return badRequestRes()

        return okayRes(clientsWithCards)
    }

    //get all client that has cards
    const clientsWithCards = await prisma.client.findMany({
        where: {
            cards: {
                some: {},
            },
        }, select: {
            id: true,
            username: true
        }
    })
    if (!clientsWithCards) return badRequestRes()

    return okayRes(clientsWithCards)

}