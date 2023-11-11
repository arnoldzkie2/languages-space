import prisma from "@/lib/db";
import { notFoundRes, existRes, badRequestRes, createdRes, serverErrorRes, okayRes } from "@/lib/utils/apiResponse";

export const POST = async (req: Request) => {

    const { clientID, clientCardID } = await req.json()

    try {
        //retrieve client
        const client = await prisma.client.findUnique({ where: { id: clientID } })
        if (!client) return notFoundRes('Client')

        //retrieve card
        const card = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })
        if (!card) return notFoundRes('Client Card')

        const { name, price, balance, validity, invoice, repeat_purchases, online_renews, settlement_period, id } = card

        //check if the repeat purchases is not supported
        if (!repeat_purchases) {
            const existingCard = await prisma.clientCard.findFirst({ where: { clientID, name } })
            if (existingCard) return existRes('client_card')
        }

        //calculate the expiration date to the card
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + validity * 24 * 60 * 60 * 1000);

        const expirationYear = expirationDate.getFullYear();
        const expirationMonth = String(expirationDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const expirationDay = String(expirationDate.getDate()).padStart(2, '0');
        const formattedExpirationDate = `${expirationYear}-${expirationMonth}-${expirationDay}`;

        //finally bind the card to client
        const bindCard = await prisma.clientCard.create({
            data: {
                name, price, balance, card: { connect: { id } }, invoice, validity: formattedExpirationDate,
                repeat_purchases, online_renews, settlement_period, client: { connect: { id: clientID } }
            },
            include: { client: true }
        })
        if (!bindCard) return badRequestRes()

        return createdRes(bindCard)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
