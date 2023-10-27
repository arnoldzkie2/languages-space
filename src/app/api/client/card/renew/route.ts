import { notFoundRes, existRes, badRequestRes, createdRes, serverErrorRes } from "@/lib/utils/apiResponse"
import prisma from "@/lib/db"

export const POST = async (req: Request) => {

    const { clientID, clientCardID } = await req.json()

    try {

        const client = await prisma.client.findUnique({ where: { id: clientID } })

        if (!client) return notFoundRes('Client')

        const card = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })

        if (!card) return notFoundRes('Client Card')

        const { name, price, balance, invoice, validity, repeat_purchases, online_purchases, online_renews, settlement_period } = card

        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + validity * 24 * 60 * 60 * 1000)
        const expirationMonth = expirationDate.getMonth() + 1
        const expirationDay = expirationDate.getDate();
        const expirationYear = expirationDate.getFullYear();
        const formattedExpirationDate = `${expirationMonth}/${expirationDay}/${expirationYear}`;

        const renewCard = await prisma.clientCard.update({
            where: { id: clientCardID, clientID },
            data: {
                name, price, balance, invoice, validity: formattedExpirationDate, repeat_purchases, online_purchases, online_renews, settlement_period
            }
        })

        if (!renewCard) return badRequestRes()

        return createdRes(renewCard)

    } catch (error) {

        console.log(error);

        return serverErrorRes(error)

    } finally {

        prisma.$disconnect()
    }
}