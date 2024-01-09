import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import stripe from "@/utils/getStripe";


interface Data {
    clientID: string
    cardID: string
    quantity: number
}

export const POST = async (req: Request) => {

    try {

        const data = await req.text()
        const signature = req.headers.get('stripe-signature')

        if (signature) {

            const event = stripe.webhooks.constructEvent(data, signature, process.env.STRIPE_WEBHOOK_SECRET!)

            if (event.type === 'checkout.session.completed') {
                const session: any = event.data.object
                const { clientID, cardID, quantity }: Data = session.metadata
                
                //retrive client and card
                const [client, card] = await Promise.all([
                    prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } }),
                    prisma.clientCardList.findUnique({ where: { id: cardID } })
                ])
                if (!client) return notFoundRes('Client')
                if (!card) return notFoundRes('Client Card')

                const existCard = await prisma.clientCard.findFirst({ where: { clientID, cardID } })

                //add the validity date
                const currentDate = new Date();
                const expirationDate = new Date(currentDate.getTime() + (card.validity * quantity) * 24 * 60 * 60 * 1000);
                const expirationYear = expirationDate.getFullYear();
                const expirationMonth = String(expirationDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
                const expirationDay = String(expirationDate.getDate()).padStart(2, '0');
                const formattedExpirationDate = `${expirationYear}-${expirationMonth}-${expirationDay}`;

                if (existCard && card.repeat_purchases) {

                    //renew the card for user
                    const renewCard = await prisma.clientCard.update({
                        where: { id: existCard.id },
                        data: {
                            price: card.price,
                            balance: existCard.balance + (card.balance * Number(quantity)),
                            validity: formattedExpirationDate,
                        }
                    })
                    if (!renewCard) return badRequestRes()

                } else {

                    //bind the card to user and connect the client department to department of the card
                    const [bindCardToUser, updateClientDepartment] = await Promise.all([
                        prisma.clientCard.create({
                            data: {
                                name: card.name,
                                price: card.price,
                                balance: (card.balance * Number(quantity)),
                                validity: formattedExpirationDate,
                                client: { connect: { id: client.id } },
                                invoice: card.invoice,
                                repeat_purchases: card.repeat_purchases,
                                online_renews: card.online_renews,
                                card: { connect: { id: card.id } }
                            }
                        }),
                        prisma.client.update({
                            where: { id: clientID }, data: {
                                departments: { connect: { id: card.departmentID } }
                            }
                        })
                    ])

                    if (!bindCardToUser || !updateClientDepartment) return badRequestRes()

                }

                //update the cardsold and create order
                const [updateCardSold, createOrder] = await Promise.all([
                    prisma.clientCardList.update({
                        where: { id: card.id }, data: {
                            sold: card.sold + 1
                        }
                    }),
                    prisma.order.create({
                        data: {
                            client: { connect: { id: client.id } },
                            card: { connect: { id: card.id } },
                            price: card.price, quantity: Number(quantity),
                            operator: 'client',
                            status: 'paid',
                            department: { connect: { id: card.departmentID } }
                        }
                    })
                ])
                if (!updateCardSold || !createOrder) return badRequestRes()

                return okayRes()
            }

            return badRequestRes()
        }

        return badRequestRes()
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }

}