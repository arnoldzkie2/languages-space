import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { ADMIN, COMPLETED } from "@/utils/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        //check if user is authorized and check their type only admin and super admin can proceed
        if (!session || !['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        //get the transactionID in body
        const { transactionID } = await req.json()
        if (!transactionID) return notFoundRes("Transaction")
        //if transactionID is not pass return 404

        const transaction = await prisma.supplierBalanceTransactions.findUnique({ where: { id: transactionID } })
        if (!transaction) return notFoundRes("Transaction")
        //return 404 if transaction does not exist

        //return 400 response with this message if the transaction already completed
        if (transaction.status === COMPLETED) return NextResponse.json({ msg: 'Transaction is already completed' }, { status: 400 })

        const adminName = session.user.type === ADMIN ? session.user.name : 'Handsome Man'

        //update the transaction status and paid by
        const updateTransaction = await prisma.supplierBalanceTransactions.update({
            where: { id: transaction.id },
            data: {
                status: COMPLETED,
                paid_by: adminName
            }, include: {
                balance: {
                    include: {
                        supplier: true
                    }
                }
            }
        })
        if (!updateTransaction) return badRequestRes()
        //return 400 response if it fails

        //get the supplier data
        const supplier = updateTransaction.balance.supplier

        //send emails to supplier to notify the payment is completed
        if (supplier.email) {
            axios.post(`${process.env.NEXTAUTH_URL}/api/email/payment/completed`, {
                name: supplier.name,
                email: supplier.email,
                paidBy: adminName,
                amount: updateTransaction.amount,
                transactionID: updateTransaction.id
            })
        }

        return okayRes()
        //return 200 response
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}