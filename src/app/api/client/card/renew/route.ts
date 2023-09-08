import { notFoundRes, existRes, badRequestRes, createdRes, serverErrorRes } from "@/lib/api/response"
import prisma from "@/lib/db"

export const POST = async (req: Request) => {

    const { clientID, clientCardID } = await req.json()

    try {

        const client = await prisma.client.findUnique({ where: { id: clientID } })

        if (!client) return notFoundRes('Client')

        const card = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })

        if (!card) return notFoundRes('Client Card')

        const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = card

        const renewCard = await prisma.clientCard.update({
            where: { id: clientCardID, client_id: clientID },
            data: {
                name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period, client: { connect: { id: clientID } }
            },
            include: { client: true }
        })

        if (!renewCard) return badRequestRes()

        return createdRes(renewCard)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()
    }
}