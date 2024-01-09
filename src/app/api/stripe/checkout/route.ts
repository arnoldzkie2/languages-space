import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import stripe from "@/utils/getStripe";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { cardID, quantity } = await req.json()

    if (!cardID) return notFoundRes('Card')
    if (!quantity) return notFoundRes('Quantity')

    try {

        const session = await getAuth()
        if (!session || session.user.type !== 'client') return unauthorizedRes()

        const [client, card] = await Promise.all([
            prisma.client.findUnique({ where: { id: session.user.id }, include: { cards: true } }),
            prisma.clientCardList.findUnique({ where: { id: cardID } })

        ])
        if (!client) return notFoundRes('Client')
        if (!card) return notFoundRes('Card')

        if (!card.repeat_purchases && client.cards.some(existingCard => existingCard.cardID === card.id)) {
            return NextResponse.json({ msg: 'You can only buy this card once.' }, { status: 400 })
        }

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

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}