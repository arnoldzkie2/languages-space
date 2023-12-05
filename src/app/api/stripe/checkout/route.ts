import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import stripe from "@/utils/getStripe";

export const POST = async (req: Request) => {

    const { cardID, quantity } = await req.json()

    if (!cardID) return notFoundRes('Client Card')
    if (!quantity) return notFoundRes('Quantity')

    const session = await getAuth()
    if (!session) return unauthorizedRes()

    try {

        if (session.user.type === 'client') {

            const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
            if (!card) return notFoundRes('Client Card')

            const client = await prisma.client.findUnique({ where: { id: session.user.id } })
            if (!client) return notFoundRes('Client')

            const stripeSession = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: card.productPriceID,
                        quantity
                    },
                ],
                metadata: {
                    clientID: session.user.id, cardID, quantity
                },
                mode: 'payment',
                success_url: `${process.env.NEXTAUTH_URL}/client/profile/cards`,
                cancel_url: `${process.env.NEXTAUTH_URL}/client/buy`
            })
            if (!session) return badRequestRes()

            return okayRes(stripeSession.url)

        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }
}