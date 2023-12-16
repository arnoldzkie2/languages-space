import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import BookingCanceledClient from "@/lib/emails/BookingCancelClient";
import BookingCanceledSupplier from "@/lib/emails/BookingCancelSupplier";

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (req: NextRequest) => {

    try {

        const { bookingID, operator } = await req.json()

        if (!operator) return notFoundRes('Operator')
        if (bookingID) {

            const booking = await prisma.booking.findUnique({
                where: { id: bookingID }, select: {
                    client: true,
                    supplier: true,
                    meeting_info: true,
                    schedule: true,
                    course: true,
                    card_name: true,
                    clientCardID: true
                }
            })
            if (!booking) return notFoundRes('Booking')

            const { client, supplier, schedule, meeting_info } = booking

            const card = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!card) return badRequestRes()

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking.supplier.id, cardID: card.cardID } })
            if (!supplierPrice) return badRequestRes()

            if (client.email && client.name) {

                const sendEmailToClient = await resend.emails.send({
                    from: 'VerbalAce <support@verbalace.com>',
                    to: client.email,
                    subject: `Booking Canceled - Schedule: ${schedule.date} at ${schedule.time}`,
                    react: BookingCanceledClient({
                        supplierName: supplier.name,
                        clientName: client.name,
                        schedule: {
                            date: booking.schedule.date,
                            time: booking.schedule.time
                        },
                        cardName: card.name,
                        cardBalance: card.balance + supplierPrice.price,
                        price: supplierPrice.price,
                        course: booking.course.name,
                        meetingInfo: meeting_info as {
                            id: string,
                            service: string,
                            meeting_code: string
                        }, operator
                    }),
                    reply_to: 'VerbalAce <support@verbalace.com>'
                })
                if (!sendEmailToClient) return badRequestRes()

            }

            if (supplier.email && supplier.name && client.name) {
                const sendEmailToSupplier = await resend.emails.send({
                    from: 'VerbalAce <support@verbalace.com>',
                    to: supplier.email,
                    subject: `Booking Canceled - Schedule: ${schedule.date} at ${schedule.time}`,
                    react: BookingCanceledSupplier({
                        supplierName: supplier.name,
                        clientName: client.name,
                        schedule: {
                            date: booking.schedule.date,
                            time: booking.schedule.time
                        },
                        course: booking.course.name,
                        meetingInfo: meeting_info as {
                            id: string,
                            service: string,
                            meeting_code: string
                        }, operator
                    }),
                    reply_to: 'VerbalAce <support@verbalace.com>'
                })
                if (!sendEmailToSupplier) return badRequestRes()
            }

            return okayRes()
        }

        return notFoundRes("Booking")

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }
}