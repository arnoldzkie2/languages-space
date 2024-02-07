import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { DEPARTMENTID, OPERATOR, PENDING, SUPERADMIN, SUPPLIER } from "@/utils/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {

    try {

        const departmentID = getSearchParams(req, DEPARTMENTID)

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === SUPPLIER) {

            const supplier = await prisma.supplier.findUnique({
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
            if (!supplier) return notFoundRes(SUPPLIER)

            return okayRes(supplier.balance[0].transactions)
        }

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        if (departmentID) {

            const cashoutTransactions = await prisma.supplierBalanceTransactions.findMany(
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
                                supplier: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        balance: {
                            supplier: {
                                departments: {
                                    some: {
                                        id: departmentID
                                    }
                                }
                            }
                        }
                    }
                },
            )
            return okayRes(cashoutTransactions)
        }

        const allCashoutTransactions = await prisma.supplierBalanceTransactions.findMany(
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
                            supplier: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
            },
        )
        if (!allCashoutTransactions) return badRequestRes("Failed to retrieve transactions")

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

        //check if user is supplier
        if (!operator) return notFoundRes(OPERATOR)
        if (session.user.type === SUPPLIER) {

            //retrieve supplier
            const supplier = await prisma.supplier.findUnique({ where: { id: session.user.id }, include: { balance: true } })
            if (!supplier) return notFoundRes(SUPPLIER)
            //return 404 if supplier not exist

            //destruct the balance
            const balance = supplier.balance[0]

            //check if supplier has enough balance to request a payment
            if (!Number(balance.amount)) return badRequestRes("Not enough balance to request a payment")

            //this will return currency symbol
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

            //update supplier balance and create a transaction
            const [updateSupplierBalance, createTransactions] = await Promise.all([
                prisma.supplierBalance.update({
                    where:
                        { id: balance.id }, data: { amount: 0 }
                }),
                prisma.supplierBalanceTransactions.create({
                    data: {
                        amount: transactionAmount,
                        status: PENDING,
                        operator,
                        payment_address: balance.payment_address,
                        balance: { connect: { id: balance.id } }
                    }
                })
            ])
            if (!updateSupplierBalance || !createTransactions) return badRequestRes()

            //send email to supplier saying we received the payment request
            if (supplier.email) {
                axios.post(`${process.env.NEXTAUTH_URL}/api/email/payment/received`, {
                    name: supplier.name,
                    amount: transactionAmount,
                    transactionID: createTransactions.id,
                    email: supplier.email
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