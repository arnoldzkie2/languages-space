import prisma from "@/lib/db";
import ClientBookingRequestCanceled from "@/lib/emails/ClientBookingRequestCanceled";
import SupplierBookingRequestCanceled from "@/lib/emails/SupplierBookingRequestCanceled";
import { okayRes, serverErrorRes } from "@/utils/apiResponse";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const {
            supplierEmail,
            supplierName,
            clientName,
            clientEmail,
            date,
            time,
            course,
            meetingInfo,
            operator,
            price,
            cardBalance,
            cardName
        } = await req.json()

        //send supplier email without waiting
        if (supplierEmail && clientName) {
            resend.emails.send({
                from: 'VerbalAce <support@verbalace.com>',
                to: supplierEmail,
                subject: `Booking Request Canceled - Schedule: ${date} at ${time}`,
                react: SupplierBookingRequestCanceled({
                    supplierName: supplierName,
                    clientName: clientName,
                    schedule: {
                        date, time
                    },
                    meetingInfo, course, operator
                }),
                reply_to: 'VerbalAce <support@verbalace.com>'
            })
        }

        if (clientEmail) {
            resend.emails.send({
                from: 'VerbalAce <support@verbalace.com>',
                to: clientEmail,
                subject: `Booking Request Canceled - Schedule: ${date} at ${time}`,
                react: ClientBookingRequestCanceled({
                    supplierName,
                    clientName,
                    schedule: {
                        date, time
                    },
                    meetingInfo, course, operator,
                    cardBalance, cardName, price
                }),
                reply_to: 'VerbalAce <support@verbalace.com>'
            })
        }

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}