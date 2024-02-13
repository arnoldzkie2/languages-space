import { notFoundRes, badRequestRes, serverErrorRes, okayRes, unauthorizedRes } from "@/utils/apiResponse"
import prisma from "@/lib/db"
import { getAuth } from "@/lib/nextAuth"
import { checkIsAdmin } from "@/utils/checkUser"
import { ADMIN } from "@/utils/constants"

export const POST = async (req: Request) => {

    const { clientCardID } = await req.json()

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //allow admin only
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //retrieve card
        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true, client: true } })
        if (!card) return notFoundRes('Client Card')

        const { name, balance, validity } = card.card

        //renew the expsiration date
        const currentDate = new Date()
        const expirationDate = new Date(currentDate.getTime() + validity * 24 * 60 * 60 * 1000);
        const expirationYear = expirationDate.getFullYear();
        const expirationMonth = String(expirationDate.getMonth() + 1).padStart(2, '0');
        const expirationDay = String(expirationDate.getDate()).padStart(2, '0');
        const formattedExpirationDate = `${expirationYear}-${expirationMonth}-${expirationDay}`;

        //renew card
        const renewCard = await prisma.clientCard.update({
            where: { id: card.id },
            data: {
                name,
                balance: card.balance + balance,
                validity: formattedExpirationDate,
            }
        })
        if (!renewCard) return badRequestRes("Failed to renew card")
        //return 400 response if it fails

        //update card sold
        const updateCardSold = await prisma.clientCardList.update({
            where: { id: card.cardID },
            data: { sold: card.card.sold + 1 }
        })
        if (!updateCardSold) return badRequestRes("Failed to update card sold")

        //if card is prepaid create an order
        if (card.card.prepaid) {

            ///create an order
            const createOrder = await prisma.order.create({
                data: {
                    client: { connect: { id: card.client.id } },
                    name: `Renewed: ${card.card.name}`,
                    cardID: card.card.id,
                    price: card.price,
                    quantity: 1,
                    operator: ADMIN,
                    status: 'paid',
                    departments: { connect: { id: card.card.departmentID } }
                }
            })
            if (!createOrder) return badRequestRes("Failed to create order")
            //return 400 response if it fails
        }

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}