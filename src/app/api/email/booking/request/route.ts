import prisma from "@/lib/db";
import ClientBookingRequestCreated from "@/lib/emails/ClientBookingRequestCreated";
import SupplierBookingRequestCreated from "@/lib/emails/SupplierBookingRequestCreated";
import { okayRes, serverErrorRes } from "@/utils/apiResponse";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const {
            supplierName,
            supplierEmail,
            clientName,
            clientEmail,
            date,
            time,
            course,
            meetingInfo,
            operator,
            cardName,
            cardBalance,
            price
        } = await req.json()

        //send supplier email without waiting
        if (supplierEmail && clientName) {
            resend.emails.send({
                from: 'VerbalAce <support@verbalace.com>',
                to: supplierEmail,
                subject: `Booking Request Created - Schedule: ${date} at ${time}`,
                react: SupplierBookingRequestCreated({
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

        if (clientEmail && supplierName) {
            resend.emails.send({
                from: 'VerbalAce <support@verbalace.com>',
                to: clientEmail,
                subject: `Booking Request Created - Schedule: ${date} at ${time}`,
                react: ClientBookingRequestCreated({
                    supplierName,
                    clientName,
                    schedule: {
                        date, time
                    },
                    cardName, cardBalance, price,
                    meetingInfo, course, operator
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