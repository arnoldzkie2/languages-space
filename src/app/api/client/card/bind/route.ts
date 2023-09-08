import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { notFoundRes, existRes, badRequestRes, createdRes, serverErrorRes, okayRes } from "@/lib/api/response";

export const POST = async (req: Request) => {

    const { clientID, clientCardID } = await req.json()

    try {

        const client = await prisma.client.findUnique({ where: { id: clientID } })

        if (!client) return notFoundRes('Client')

        const card = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })

        if (!card) return notFoundRes('Client Card')

        const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = card

        const existingCard = await prisma.clientCard.findFirst({ where: { client_id: clientID, name } })

        if (existingCard) return existRes('client_card')

        const bindCard = await prisma.clientCard.create({
            data: {
                name, price, balance, validity, card_id: clientCardID, invoice, repeat_purchases, online_purchases, online_renews, settlement_period, client: { connect: { id: clientID } }
            },
            include: { client: true }
        })

        if (!bindCard) return badRequestRes()

        return createdRes()

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const clientID = searchParams.get('clientID')

    const clientCardID = searchParams.get('clientCardID')

    try {

        if (clientCardID && clientID) {

            const checkClient = await prisma.client.findUnique({ where: { id: clientID } })

            if (!checkClient) return notFoundRes('Client')

            const checkCard = await prisma.clientCard.findUnique({ where: { id: clientCardID, client_id: clientID } })

            if (!checkCard) return notFoundRes('Card in Client')

            const removeCard = await prisma.clientCard.delete({ where: { id: clientCardID, client_id: clientID } })

            if (!removeCard) return badRequestRes()

            return okayRes()

        }

        if (!clientID) return notFoundRes('clientID')

        if (!clientCardID) return notFoundRes('clientCardID')

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}