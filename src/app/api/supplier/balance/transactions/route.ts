import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {

    try {

        const departmentID = getSearchParams(req, 'departmentID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {

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
                                },
                                orderBy: { created_at: 'desc' }
                            }
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.balance[0].transactions)
        }

        if (!(session.user.type === 'admin' || session.user.type === 'super-admin')) {
            return unauthorizedRes();
        }

        if (departmentID) {

            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    suppliers: {
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
                                                    supplier: {
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
            if (!department) return notFoundRes('Department')

            const cashouts = department.suppliers.map(supplier => supplier.balance[0].transactions);

            return okayRes(cashouts)

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

        const operator = getSearchParams(req, 'operator')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier' && operator) {

            const supplier = await prisma.supplier.findUnique({ where: { id: session.user.id }, include: { balance: true } })
            if (!supplier) return notFoundRes('Supplier')

            const balance = supplier.balance[0]

            if (!balance.amount) return NextResponse.json({ msg: "Not enough balance to request a payment" }, { status: 400 })

            const [updateSupplierBalance, createTransactions] = await Promise.all([
                prisma.supplierBalance.update({
                    where:
                        { id: balance.id }, data: { amount: 0 }
                }),
                prisma.supplierBalanceTransactions.create({
                    data: {
                        amount: balance.amount, status: 'pending',
                        operator,
                        payment_address: balance.payment_address,
                        balance: { connect: { id: balance.id } }
                    }
                })
            ])

            if (!updateSupplierBalance || !createTransactions) return badRequestRes()

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