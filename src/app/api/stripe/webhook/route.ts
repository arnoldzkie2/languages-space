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

        console.log(req.url);

        const data = await req.text()
        const signature = req.headers.get('stripe-signature')

        if (signature) {

            const event = stripe.webhooks.constructEvent(data, signature, process.env.STRIPE_WEBHOOK_SECRET!)

            if (event.type === 'checkout.session.completed') {
                const session: any = event.data.object
                const { clientID, cardID, quantity }: Data = session.metadata

                //retrive client and card
                const [client, card] = await Promise.all([
                    prisma.client.findUnique({
                        where: { id: clientID }, include: {
                            departments: true, agent: {
                                include: {
                                    balance: true
                                }
                            }
                        }
                    }),
                    prisma.clientCardList.findUnique({ where: { id: cardID } })
                ])
                if (!client) return notFoundRes('Client')
                if (!card) return notFoundRes('Card')

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

                const agent = client.agent

                //if agent exist in client then give the agent a commission
                if (agent) {

                    //destruct the balance
                    const balance = agent.balance[0]

                    let commissionRate: number = 0;

                    if (balance.commission_type === 'fixed') {
                        //return commissionrate if it's just fixed
                        commissionRate = balance.commission_rate;
                    } else if (balance.commission_type === 'percentage') {
                        //if commission type is percentage do this 
                        commissionRate = (balance.commission_rate / 100) * Number(card.price)
                    }

                    //update agent balance
                    const updateAgentBalance = await prisma.agentBalance.update({
                        where: { id: balance.id }, data: {
                            amount: balance.amount + commissionRate
                        }
                    })
                    if (!updateAgentBalance) return badRequestRes("Failed to update agent balance")
                    //return 400 respone if it fails

                    //create earnings for agent

                    //get the curent mont and year
                    const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
                    const currentYear = currentDate.getUTCFullYear();

                    // Construct the start and end dates in ISO format
                    const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
                    const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

                    const earnings = await prisma.agentEarnings.findFirst({
                        //retrieve earnings for this month with the same rate
                        where:
                        {
                            agentBalanceID: balance.id,
                            name: 'Commission',
                            rate: commissionRate,
                            created_at: {
                                gte: startDate.toISOString(),
                                lt: endDate.toISOString(),
                            },
                        }
                    })

                    //if earnings exist then update the earnings instead of creating a new one
                    if (earnings) {

                        //update the agentearnings for this month
                        const updateAgentEarnings = await prisma.agentEarnings.update({
                            where: { id: earnings.id }, data: {
                                amount: earnings.amount + commissionRate,
                                quantity: earnings.quantity + 1
                            }
                        })
                        if (!updateAgentEarnings) return badRequestRes("Failed to update agent earnings")
                        //return 400 respone if it fails

                    } else {

                        //if earnings does not found this month create a new earnings
                        const createAgentEarnings = await prisma.agentEarnings.create({
                            data: {
                                amount: commissionRate,
                                name: 'Commission',
                                quantity: 1,
                                rate: commissionRate,
                                balance: { connect: { id: balance.id } },
                            }
                        })
                        if (!createAgentEarnings) return badRequestRes("Failed to create earnings to agent")
                        //return 400 response if it fails

                    }
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
                if (!updateCardSold || !createOrder) return badRequestRes("Failed to create order or update card sold")
                //return 400 response if it fails

                //return 200 response
                return okayRes()
            }

            return badRequestRes("This vent type does not existin webhook")
        }

        return badRequestRes("Signature error")
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }

}