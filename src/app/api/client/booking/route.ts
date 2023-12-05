import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { BookingFormData } from "@/lib/state/client/clientStore";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'client') {

            const client = await prisma.client.findUnique({
                where: { id: session.user.id }, select: {
                    bookings: {
                        select: {
                            id: true,
                            schedule: {
                                select: {
                                    date: true,
                                    time: true
                                }
                            },
                            supplier: {
                                select: {
                                    name: true
                                }
                            },
                            card_name: true,
                            status: true,
                            note: true,
                            created_at: true
                        },
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!client) return notFoundRes('Client')

            return okayRes(client.bookings)

        }

        return badRequestRes()


    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async ({ json }: Request) => {
    try {

        const { courseID, supplierID, clientCardID, meetingInfoID, note, scheduleID, quantity, settlement }: BookingFormData = await json()

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'client') {

            const client = await prisma.client.findUnique({ where: { id: session.user.id }, select: { id: true, name: true } })
            if (!client) return notFoundRes('Client')

            const card = await prisma.clientCard.findUnique({
                where: { id: clientCardID }, select: {
                    id: true,
                    name: true,
                    cardID: true, balance: true, card: {
                        select: {
                            balance: true,
                            price: true,
                            departmentID: true
                        }
                    }
                }
            })
            if (!card) return notFoundRes('Client Card')

            const course = await prisma.courses.findUnique({ where: { id: courseID }, select: { id: true } })
            if (!course) return notFoundRes("Course")

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID }, select: {
                    id: true,
                    supplier_price: {
                        where: {
                            cardID: card.cardID
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')
            if (supplier.supplier_price[0].price > card.balance) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            const meetingInfo = await prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } })
            if (!meetingInfo) return notFoundRes('Meeting Info')

            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID }, select: { id: true } })
            if (!schedule) return notFoundRes('Schedule')

            const department = await prisma.department.findUnique({ where: { id: card.card.departmentID } })
            if (!department) return notFoundRes('Department')

            if (department.name.toLocaleLowerCase() === 'fingerpower') {

                const bookingPrice = quantity * card.card.price

                //create booking for fingerpower
                const createBooking = await prisma.booking.create({
                    data: {
                        note, status: 'pending', operator: 'client', name: 'Transcription', price: bookingPrice, card_name: card.name, quantity, settlement,
                        supplier: { connect: { id: supplierID } },
                        client: { connect: { id: session.user.id } },
                        schedule: { connect: { id: scheduleID } },
                        meeting_info: meetingInfo, clientCardID, scheduleID,
                        department: { connect: { id: department.id } },
                        course: { connect: { id: courseID } }
                    },
                })
                if (!createBooking) return badRequestRes()

            } else {

                const today = new Date()
                const settlementPeriod = today.toISOString().split('T')[0];  // Format the date as "YYYY-MM-DD"
                const bookingPrice = (card.card.price / card.card.balance) * supplier.supplier_price[0].price

                //create booking for verbalace
                const createBooking = await prisma.booking.create({
                    data: {
                        note, status: 'pending', operator: 'client', name: '1v1 Class', price: bookingPrice, card_name: card.name, quantity, settlement: settlementPeriod,
                        supplier: { connect: { id: supplierID } },
                        client: { connect: { id: session.user.id } },
                        schedule: { connect: { id: scheduleID } },
                        meeting_info: meetingInfo, clientCardID, scheduleID,
                        department: { connect: { id: department.id } },
                        course: { connect: { id: courseID } }
                    },
                })
                if (!createBooking) return badRequestRes()

                //reduce client card balance
                const reduceCardBalance = await prisma.clientCard.update({
                    where: { id: card.id },
                    data: { balance: card.balance - supplier.supplier_price[0].price }
                })
                if (!reduceCardBalance) return badRequestRes()
            }

            const updateSchedule = await prisma.supplierSchedule.update({
                where: { id: scheduleID },
                data: {
                    status: 'reserved',
                    clientID: client.id,
                    clientName: client.name
                }
            })
            if (!updateSchedule) return badRequestRes()

            return createdRes()

        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}