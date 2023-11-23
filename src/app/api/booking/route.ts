import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const bookingID = searchParams.get('bookingID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (bookingID) {

            //check booking
            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                include: {
                    supplier: {
                        select: {
                            name: true
                        }
                    }, schedule: {
                        select: {
                            date: true,
                            time: true
                        }
                    }, client: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            if (!booking) return notFoundRes('Schedule')

            return okayRes(booking)
        }

        if (departmentID) {

            //get all bookings in department
            const departmentBookings = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    bookings: {
                        include: {
                            supplier: {
                                select: {
                                    name: true
                                }
                            }, schedule: {
                                select: {
                                    date: true,
                                    time: true
                                }
                            }, client: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            if (!departmentBookings) return notFoundRes('Department')

            return okayRes(departmentBookings.bookings)
        }

        //get all bookings
        const bookings = await prisma.booking.findMany({
            include: {
                supplier: {
                    select: {
                        name: true
                    }
                }, schedule: {
                    select: {
                        date: true,
                        time: true
                    }
                }, client: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!bookings) return badRequestRes()

        return okayRes(bookings)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: Request) => {

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, quantity, departmentID, settlement } = await req.json()

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!clientCardID) return notFoundRes('clientCardiD')
    if (!departmentID) return notFoundRes('departmentID')

    try {

        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        //check schedule
        const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        if (!schedule) return notFoundRes('Schedule')
        if (schedule.status === 'reserved') return NextResponse.json({ msg: 'schedule_reserved' }, { status: 409 })

        //check client
        const client = await prisma.client.findUnique({ where: { id: clientID } })
        if (!client) return notFoundRes('Client')

        //check supplier
        const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
        if (!supplier) return notFoundRes('Supplier')

        const card = await prisma.clientCard.findUnique({
            where: { id: clientCardID }, include: {
                card: true
            }
        })
        if (!card) return notFoundRes('Card')

        //check supplier price
        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, clientCardID: card.cardID } })

        //check if supplire is supported
        if (!supplierPrice) return NextResponse.json({ msg: 'supplier_not_supported' })

        //check if balance is enough
        if (card.balance < supplierPrice.price) return NextResponse.json({ msg: 'not_enough_balance_to_book' }, { status: 400 })

        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'card expired' }, { status: 400 })

        if (department.name.toLocaleLowerCase() === 'verbalace') {

            const bookingPrice = card.price / card.card.balance

            //create booking for verbalace
            const createBooking = await prisma.booking.create({
                data: {
                    note, status, operator, name, price: bookingPrice, card_name: card.name, quantity, settlement,
                    supplier: { connect: { id: supplierID } },
                    client: { connect: { id: clientID } },
                    schedule: { connect: { id: scheduleID } },
                    meeting_info, clientCardID, scheduleID,
                    department: { connect: { id: department.id } },
                    course: { connect: { id: courseID } }
                },
            })
            if (!createBooking) return badRequestRes()

            //reduce client card balance
            const reduceClientCardBalance = await prisma.clientCard.update({
                where: { id: card.id },
                data: { balance: card.balance - supplierPrice.price }
            })
            if (!reduceClientCardBalance) return badRequestRes()

            //update the schedule
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

        } else if (department.name.toLocaleLowerCase() === 'fingerpower') {

            const bookingPrice = quantity * card.price
            const createBooking = await prisma.booking.create({
                data: {
                    note, status, operator, name, price: bookingPrice, card_name: card.name, quantity, settlement,
                    supplier: { connect: { id: supplierID } },
                    client: { connect: { id: clientID } },
                    schedule: { connect: { id: scheduleID } },
                    meeting_info, clientCardID, scheduleID,
                    department: { connect: { id: department.id } },
                    course: { connect: { id: courseID } }
                },
            })
            if (!createBooking) return badRequestRes()

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

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, departmentID, quantity, settlement } = await req.json()

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!clientCardID) return notFoundRes('clientCardiD')
    const bookingID = searchParams.get('bookingID')

    try {

        if (bookingID) {

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) return notFoundRes("Department")

            //check booking
            const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!booking) return notFoundRes('Booking')

            const prevCard = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!prevCard) return notFoundRes('Client Card')

            const prevSupplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking.supplierID, clientCardID: prevCard.cardID } })
            if (!prevSupplierPrice) return notFoundRes('Supplier Price')

            //check schedule
            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!schedule) return notFoundRes('Schedule')

            if (booking.scheduleID !== scheduleID) {
                if (schedule.status === 'reserved') return NextResponse.json({ msg: 'schedule_reserved' }, { status: 409 })
            }
            //check client
            const client = await prisma.client.findUnique({ where: { id: clientID } })
            if (!client) return notFoundRes('Client')

            //check supplier
            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            //check card
            const card = await prisma.clientCard.findUnique({
                where: { id: clientCardID }, include: {
                    card: true
                }
            })
            if (!card) return notFoundRes('Card')

            //check supplierprice
            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card.cardID } })
            if (!supplierPrice) return notFoundRes('supplier_not_supported')

            //check if balance is enough to book
            if (card.balance < supplierPrice?.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            if (department.name.toLocaleLowerCase() === 'verbalace') {

                const bookingPrice = card.price / card.card.balance

                //update the booking
                const updateBooking = await prisma.booking.update({
                    where: {
                        id: bookingID
                    },
                    data: {
                        note, status, operator, name, price: bookingPrice, courseID, card_name: card.name, quantity,settlement,
                        supplierID, clientID, clientCardID, meeting_info, scheduleID, departmentID: department.id
                    }
                })
                if (!updateBooking) return badRequestRes()

                // reduce client card balance
                const payClient = await prisma.clientCard.update({
                    where: { id: updateBooking.clientCardID },
                    data: { balance: card.balance - supplierPrice.price }
                })
                if (!payClient) return badRequestRes()

                //refund the previous client
                const refundClient = await prisma.clientCard.update({
                    where: { id: booking.clientCardID },
                    data: { balance: prevCard.balance + prevSupplierPrice.price }
                })
                if (!refundClient) return badRequestRes()

                return okayRes()

            } else if (department.name.toLocaleLowerCase() === 'fingerpower') {

                const bookingPrice = quantity * card.price

                const updateBooking = await prisma.booking.update({
                    where: {
                        id: bookingID
                    },
                    data: {
                        note, status, operator, name, price: bookingPrice, courseID, card_name: card.name, quantity,settlement,
                        supplierID, clientID, clientCardID, meeting_info, scheduleID, departmentID: department.id
                    }
                })
                if (!updateBooking) return badRequestRes()

                return okayRes()

            } else {
                return badRequestRes()
            }
        }

        return notFoundRes('bookingID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const bookingID = searchParams.get('bookingID')
    const bookingIDS = searchParams.getAll('bookingID')
    const type = searchParams.get('type')

    try {

        if (bookingIDS.length < 1) return notFoundRes('bookingID')
        if (!type) return notFoundRes('Type')

        if (type === 'delete') {

            const deleteBookings = await prisma.booking.deleteMany({
                where: { id: { in: bookingIDS } }
            })

            return okayRes(deleteBookings.count)

        }

        if (type === 'cancel') {

            if (bookingID) {

                const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
                if (!booking) return notFoundRes('Booking')

                //retrieve client card
                const clientCard = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
                if (!clientCard) return notFoundRes('Client Card')

                //refund the client
                const refundClient = await prisma.clientCard.update({
                    where: { id: clientCard.id },
                    data: { balance: clientCard.balance + booking.price }
                })
                if (!refundClient) return badRequestRes()

                // update the booking status to canceled
                const cancelBooking = await prisma.booking.update({
                    where: {
                        id: bookingID
                    }, data: { status: 'canceled' }
                })
                if (!cancelBooking) return badRequestRes()

                //update the schedule status to canceled
                const updateSchedule = await prisma.supplierSchedule.update({
                    where: {
                        id: booking.scheduleID
                    },
                    data: { status: 'canceled' }
                })
                if (!updateSchedule) return badRequestRes()

                return okayRes()

            }
        }

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}