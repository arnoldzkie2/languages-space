import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";
import stripe from "@/lib/utils/getStripe";

export const POST = async (req: Request) => {

    try {

        const data = await req.text()
        const signature = req.headers.get('stripe-signature')

        if (signature) {
            const event = stripe.webhooks.constructEvent(data, signature, process.env.STRIPE_WEBHOOK_SECRET!)

            if (event.type === 'checkout.session.completed') {
                const session: any = event.data.object
                const { clientID, cardID } = session.metadata

                //retrive client
                const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
                if (!client) return notFoundRes('User')

                //retrive card
                const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
                if (!card) return notFoundRes('Client Card')

                //add the validity date
                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + card.validity * 24 * 60 * 60 * 1000);
                const expirationYear = expirationDate.getFullYear();
                const expirationMonth = String(expirationDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
                const expirationDay = String(expirationDate.getDate()).padStart(2, '0');
                const formattedExpirationDate = `${expirationYear}-${expirationMonth}-${expirationDay}`;
        
                const bindCardToUser = await prisma.clientCard.create({
                    data: {
                        name: card.name,
                        price: card.price,
                        balance: card.balance,
                        validity: formattedExpirationDate,
                        client: { connect: { id: client.id } },
                        invoice: card.invoice,
                        repeat_purchases: card.repeat_purchases,
                        online_purchases: card.online_purchases,
                        online_renews: card.online_renews,
                        settlement_period: card.settlement_period,
                        cardID: card.id
                    }
                })
                if (!bindCardToUser) return badRequestRes()

                const createOrder = await prisma.order.create({
                    data: {
                        client: { connect: { id: client.id } },
                        card: { connect: { id: card.id } },
                        price: card.price, quantity: 1,
                        operator: 'Client',
                        status: 'Paid',
                        departments: { connect: client.departments.map((dept) => ({ id: dept.id })) }
                    }
                })
                if (!createOrder) return badRequestRes()

                return okayRes()
            }
        }
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }

}