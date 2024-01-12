import prisma from "@/lib/db";
import RequestPaymentReceived from "@/lib/emails/RequestPaymentReceived";
import { badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const { name, amount, transactionID, email } = await req.json()

        //return 400 response if one of this does not exist
        if (!name || !amount || !transactionID || !email) return badRequestRes("Missing Inputs")

        //send email that says the request payment is in process
        resend.emails.send({
            from: 'VerbalAce <support@verbalace.com>',
            to: email,
            subject: 'Payment request in process',
            react: RequestPaymentReceived({
                name, amount, transactionID
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