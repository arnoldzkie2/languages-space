import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import stripe from "@/utils/getStripe";

export const POST = async (req: Request) => {

    const { clientID, cardID, quantity } = await req.json()

    if (!clientID) return notFoundRes('Client')
    if (!cardID) return notFoundRes('Client Card')
    if (!quantity) return notFoundRes('Quantity')

    try {

        const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
        if (!card) return notFoundRes('Client Card')

        const client = await prisma.client.findUnique({ where: { id: clientID } })
        if(!client) return notFoundRes('Client')

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: card.productPriceID,
                    quantity
                },
            ],
            metadata: {
                clientID, cardID, quantity
            },
            mode: 'payment',
            success_url: `http://localhost:3000/client/profile/cards`,
            cancel_url: `http://localhost:3000/client/buy`,
        })
        if (!session) return badRequestRes()

        return okayRes(session.url)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }
}