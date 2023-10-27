import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";
import stripe from "@/lib/utils/getStripe";

export const POST = async (req: Request) => {

    const { clientID, cardID, quantity } = await req.json()

    if (!clientID) return notFoundRes('clientID')
    try {

        const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
        if (!card) return notFoundRes('Card')

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: card.productPriceID,
                    quantity
                },
            ],
            metadata: {
                clientID, cardID
            },
            mode: 'payment',
            success_url: `http://localhost:3000/client`,
            cancel_url: `http://localhost:3000/client`,
        });

        if (!session) return badRequestRes()

        return okayRes(session.url)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }
}