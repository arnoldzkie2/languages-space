import prisma from "@/lib/db";
import PaymentCompleted from "@/lib/emails/PaymentCompleted";
import { badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {

    try {

        const { name, paidBy, amount, transactionID, email } = await req.json()

        //return 400 response if one of this does not exist
        if (!name || !paidBy || !amount || !transactionID || !email) return badRequestRes("Missing Inputs")

        //send payment completed email synchronously
        resend.emails.send({
            from: 'VerbalAce <support@verbalace.com>',
            to: email,
            subject: 'Payment rqeuest completed',
            react: PaymentCompleted({
                name, paidBy, amount, transactionID
            }),
            reply_to: 'VerbalAce <support@verbalace.com>'
        });

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}