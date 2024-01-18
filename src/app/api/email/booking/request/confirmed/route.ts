import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import resend from "@/utils/getResend";
import ClientBookingRequestConfirmed from "@/lib/emails/ClientBookingRequestConfirmed";
import SupplierBookingRequestConfirmed from "@/lib/emails/SupplierBookingRequestConfirmed";

export const POST = async (req: NextRequest) => {

    try {

        const { bookingID, operator } = await req.json()

        if (!bookingID) return notFoundRes("Booking")
        if (!operator) return badRequestRes()

        const booking = await prisma.booking.findUnique({
            where: { id: bookingID }, select: {
                client: true,
                supplier: {
                    include: { balance: true }
                },
                meeting_info: true,
                schedule: true,
                course: true,
                card_name: true,
                supplier_rate: true,
                clientCardID: true
            }
        })

        const card = await prisma.clientCard.findUnique({ where: { id: booking!.clientCardID } })
        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking!.supplier.id, cardID: card!.cardID } })

        if (booking && card && supplierPrice) {

            const { client, supplier, schedule, meeting_info } = booking!

            if (client.email && client.name) {
                resend.emails.send({
                    from: 'VerbalAce <support@verbalace.com>',
                    to: client.email,
                    subject: `Booking Created - Schedule: ${schedule.date} at ${schedule.time}`,
                    react: ClientBookingRequestConfirmed({
                        supplierName: supplier.name, operator,
                        clientName: client.name,
                        schedule: {
                            date: booking.schedule.date,
                            time: booking.schedule.time
                        },
                        cardName: card.name,
                        cardBalance: card.balance + supplierPrice.price,
                        price: supplierPrice.price,
                        course: booking.course.name,
                        meetingInfo: meeting_info as any
                    }),
                    reply_to: 'VerbalAce <support@verbalace.com>'
                })
            }

            if (supplier.email && supplier.name && client.name) {
                resend.emails.send({
                    from: 'VerbalAce <support@verbalace.com>',
                    to: supplier.email,
                    subject: `Booking Created - Schedule: ${schedule.date} at ${schedule.time}`,
                    react: SupplierBookingRequestConfirmed({
                        supplierName: supplier.name, operator,
                        clientName: client.name,
                        schedule: {
                            date: booking.schedule.date,
                            time: booking.schedule.time
                        },
                        course: booking.course.name,
                        meetingInfo: meeting_info as any,
                        supplier_rate: booking.supplier_rate,
                        balance: supplier.balance[0].amount,
                    }),
                    reply_to: 'VerbalAce <support@verbalace.com>'
                })
            }
        }

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}