import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { ADMIN, DEPARTMENT, DEPARTMENTID, OPERATOR, PENDING, SUPERADMIN, AGENT } from "@/utils/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {

    try {

        const departmentID = getSearchParams(req, DEPARTMENTID)

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === AGENT) {

            const agent = await prisma.agent.findUnique({
                where: { id: session.user.id },
                select: {
                    balance: {
                        select: {
                            transactions: {
                                select: {
                                    id: true,
                                    payment_address: true,
                                    status: true,
                                    created_at: true,
                                    amount: true,
                                    paid_by: true
                                },
                                orderBy: { created_at: 'desc' }
                            }
                        }
                    }
                }
            })
            if (!agent) return notFoundRes(AGENT)

            return okayRes(agent.balance[0].transactions)
        }

        if (![SUPERADMIN, ADMIN].includes(session.user.type)) return unauthorizedRes()

        if (departmentID) {

            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    agents: {
                        select: {
                            balance: {
                                select: {
                                    transactions: {
                                        orderBy: { created_at: 'desc' },
                                        select: {
                                            id: true,
                                            payment_address: true,
                                            status: true,
                                            created_at: true,
                                            amount: true,
                                            paid_by: true,
                                            balance: {
                                                select: {
                                                    agent: {
                                                        select: {
                                                            name: true
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            })
            if (!department) return notFoundRes(DEPARTMENT)

            const cashouts = department.agents.flatMap(agent => agent.balance[0].transactions);
            return okayRes(cashouts)

        }

        const allCashoutTransactions = await prisma.agentBalanceTransactions.findMany(
            {
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    payment_address: true,
                    status: true,
                    created_at: true,
                    amount: true,
                    paid_by: true,
                    balance: {
                        select: {
                            agent: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
            },
        )
        if (!allCashoutTransactions) return badRequestRes()

        return okayRes(allCashoutTransactions)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {

    try {
        //authorized user
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //get operator to know who made this request 
        const { operator } = await req.json()

        //check if user is agent
        if (!operator) return notFoundRes("Operator")
        if (session.user.type === AGENT) {

            //retrieve agent
            const agent = await prisma.agent.findUnique({ where: { id: session.user.id }, include: { balance: true } })
            if (!agent) return notFoundRes(AGENT)
            //return 404 if agent not exist

            //destruct the balance
            const balance = agent.balance[0]

            //check if agent has enough balance to request a payment
            if (!Number(balance.amount)) return badRequestRes("Not enough balance to request a payment")

            const returnCurrency = (currency: string) => {
                switch (currency) {
                    case 'USD':
                        return '$'
                    case 'PHP':
                        return '₱'
                    case 'VND':
                        return '₫'
                    case 'RMB':
                        return '¥'
                    default:
                        return 'Unknown Currency'
                }
            }
            //this will return currency followed by transaction amount ex: $100
            const transactionAmount = `${returnCurrency(balance.currency)}${balance.amount}`

            const [updateSupplierBalance, createTransactions] = await Promise.all([
                prisma.agentBalance.update({
                    where:
                        { id: balance.id }, data: { amount: 0 }
                }),
                prisma.agentBalanceTransactions.create({
                    data: {
                        amount: transactionAmount, status: PENDING,
                        operator,
                        payment_address: balance.payment_address,
                        balance: { connect: { id: balance.id } }
                    }
                })
            ])
            if (!updateSupplierBalance || !createTransactions) return badRequestRes()

            //send email to agent saying we received the payment request
            if (agent.email) {
                axios.post(`${process.env.NEXTAUTH_URL}/api/email/payment/received`, {
                    name: agent.name,
                    amount: transactionAmount,
                    transactionID: createTransactions.id,
                    email: agent.email
                })
            }

            //return 200 response
            return okayRes()
        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}