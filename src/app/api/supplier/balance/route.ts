import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const supplierID = getSearchParams(req, 'supplierID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {
            const supplier = await prisma.supplier.findUnique({ where: { id: session.user.id }, include: { balance: true } })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.balance[0])
        }

        if (supplierID) {

            if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.balance[0])
        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {

    const supplierID = getSearchParams(req, 'supplierID')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        let supplier;

        if (session.user.type === 'supplier') {

            supplier = await prisma.supplier.findUnique({
                where: { id: session.user.id },
                select: { balance: true }
            });

        } else if (['super-admin', 'admin'].includes(session.user.type) && supplierID) {

            supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: { balance: true }
            });

        } else return unauthorizedRes()

        if (!supplier) return notFoundRes('Supplier');

        const balance = supplier.balance[0]

        if (!balance.amount) return NextResponse.json({ msg: 'Not enough balance to request a payment' }, { status: 400 })

        const [createTransaction, updateSupplierBalance] = await Promise.all([
            prisma.supplierBalanceTransactions.create({
                data: {
                    payment_address: balance.payment_address,
                    amount: balance.amount,
                    status: 'pending',
                    operator: session.user.type === 'supplier' ? 'supplier' : 'admin',
                    balance: { connect: { id: balance.id } }
                }
            }),
            prisma.supplierBalance.update({
                where: {
                    id: balance.id
                }, data: { amount: balance.amount - balance.amount }
            })
        ])
        if (!createTransaction || updateSupplierBalance) return badRequestRes();

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}