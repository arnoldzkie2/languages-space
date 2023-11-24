import { notFoundRes, existRes, badRequestRes, createdRes, serverErrorRes, okayRes } from "@/lib/utils/apiResponse"
import prisma from "@/lib/db"

export const POST = async (req: Request) => {

    const { clientCardID } = await req.json()

    try {

        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })
        if (!card) return notFoundRes('Client Card')

        const { name, price, balance, invoice, validity, repeat_purchases, online_renews } = card.card

        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + validity * 24 * 60 * 60 * 1000)
        const expirationMonth = expirationDate.getMonth() + 1
        const expirationDay = expirationDate.getDate();
        const expirationYear = expirationDate.getFullYear();
        const formattedExpirationDate = `${expirationYear}-${expirationMonth}-${expirationDay}`;

        const renewCard = await prisma.clientCard.update({
            where: { id: card.id },
            data: {
                name, price,
                balance, invoice,
                validity: formattedExpirationDate,
                repeat_purchases, online_renews
            }
        })
        if (!renewCard) return badRequestRes()

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}