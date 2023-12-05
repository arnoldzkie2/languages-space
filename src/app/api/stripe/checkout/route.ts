import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import stripe from "@/utils/getStripe";

export const POST = async (req: Request) => {

    const { cardID, quantity, clientID } = await req.json()

    if (!cardID) return notFoundRes('Client Card')
    if (!quantity) return notFoundRes('Quantity')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID } })
            if (!client) return notFoundRes('Client')

            const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
            if (!card) return notFoundRes('Client Card')

            const stripeSession = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: card.productPriceID,
                        quantity
                    },
                ],
                metadata: {
                    clientID: client.id, cardID, quantity
                },
                mode: 'payment',
                success_url: `${process.env.NEXTAUTH_URL}/client/profile/cards`,
                cancel_url: `${process.env.NEXTAUTH_URL}/client/buy`
            })
            if (!stripeSession) return badRequestRes()

            return okayRes(stripeSession.url)

        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}