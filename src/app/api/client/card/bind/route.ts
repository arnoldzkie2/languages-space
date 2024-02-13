import prisma from "@/lib/db";
import { notFoundRes, existRes, badRequestRes, createdRes, serverErrorRes } from "@/utils/apiResponse";
import { ADMIN } from "@/utils/constants";

export const POST = async (req: Request) => {

    const { clientID, cardID } = await req.json()

    try {
        //retrieve client
        const client = await prisma.client.findUnique({ where: { id: clientID } })
        if (!client) return notFoundRes('Client')

        //retrieve card
        const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
        if (!card) return notFoundRes('Client Card')

        const { name, price, balance, validity, invoice, repeat_purchases, online_renews, id, prepaid } = card

        //check if the repeat purchases is not supported
        const existingCard = await prisma.clientCard.findFirst({ where: { clientID, name } })
        if (existingCard) return badRequestRes('Client already has this card renew this instead')

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
                repeat_purchases, online_renews, client: { connect: { id: clientID } }
            },
            include: { client: true }
        })
        if (!bindCard) return badRequestRes("Failed to bind card to client")
        //return 400 response if it fails

        //update card sold
        const updateCardSold = await prisma.clientCardList.update({
            where: { id: bindCard.cardID }, data: { sold: card.sold + 1 }
        })
        if (!updateCardSold) return badRequestRes("Failed to update card sold")

        //if card is prepaid create an order
        if (prepaid) {
            const createOrder = await prisma.order.create({
                data: {
                    quantity: 1,
                    price,
                    operator: ADMIN,
                    status: 'paid',
                    name: `Bought: ${card.name}`,
                    cardID: card.id,
                    client: {
                        connect: {
                            id: clientID
                        }
                    },
                    departments: {
                        connect: {
                            id: card.departmentID
                        }
                    }
                }
            })
            if (!createOrder) return badRequestRes("Failed to create order")
            //return 400 response if it fails
        }

        //return 201 response
        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
