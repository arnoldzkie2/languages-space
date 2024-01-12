import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import stripe from "@/utils/getStripe";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {


    try {
        
        const { cardID, quantity } = await req.json()

        if (!cardID) return notFoundRes('Card')
        if (!quantity) return notFoundRes('Quantity')

        //authorize user
        const session = await getAuth()
        if (!session || session.user.type !== 'client') return unauthorizedRes()
        //only client are allowed to buy

        //retrieve client and card to buy
        const [client, card] = await Promise.all([
            prisma.client.findUnique({ where: { id: session.user.id }, include: { cards: true } }),
            prisma.clientCardList.findUnique({ where: { id: cardID } })

        ])
        if (!client) return notFoundRes('Client')
        if (!card) return notFoundRes('Card')
        //return 404 response if one of them does not exist

        //check if card supported to purchase multiply times or not
        if (!card.repeat_purchases && client.cards.some(existingCard => existingCard.cardID === card.id)) {
            return NextResponse.json({ msg: 'You can only buy this card once.' }, { status: 400 })
        }

        //create stripe session
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
        if (!stripeSession) return badRequestRes("Failed to create session") // return 400 response if it fails


        //return 200 response and pass the stripesession url
        //we will use this session url to navigate the client to checkout page
        return okayRes(stripeSession.url)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}