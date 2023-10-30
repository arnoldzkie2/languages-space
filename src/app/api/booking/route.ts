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
            const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!booking) return notFoundRes('Schedule')

            return okayRes(booking)
        }

        if (departmentID) {

            //get all bookings in department
            const departmentBookings = await prisma.department.findUnique({ where: { id: departmentID }, select: { bookings: true } })
            if (!departmentBookings) return notFoundRes('Department')

            return okayRes(departmentBookings.bookings)
        }

        //get all bookings
        const bookings = await prisma.supplierSchedule.findMany({ where: { reserved: true } })
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

    const { scheduleID, supplierID, clientID, note, operator, meetingInfoID, clientCardID, status, name } = await req.json()

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!meetingInfoID) return notFoundRes('meetingInfoID')
    if (!clientCardID) return notFoundRes('clientCardiD')

    try {

        //check schedule
        const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        if (!schedule) return notFoundRes('Schedule')
        if (schedule.reserved) return NextResponse.json({ msg: 'This schedule is already reserved' }, { status: 409 })

        //check client
        const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
        if (!client) return notFoundRes('Client')

        //check supplier
        const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
        if (!supplier) return notFoundRes('Supplier')

        //get the supplier price
        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID } })
        if (!supplierPrice) return notFoundRes('Supplier Price')

        //check supplier meeting info
        const meetingInfo = await prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } })
        if (!meetingInfo) return notFoundRes('Meeting Info')

        //check card
        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
        if (!card) return notFoundRes('Card')
        if (card.balance < supplierPrice.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

        //create booking
        const createBooking = await prisma.booking.create({
            data: {
                note, status, operator, name, price: supplierPrice.price,
                supplier: { connect: { id: supplierID } },
                client: { connect: { id: clientID } },
                meeting_info: { connect: { id: meetingInfoID } },
                schedule: { connect: { id: scheduleID } },
                client_card: { connect: { id: clientCardID } }
            }
        })
        if (!createBooking) return badRequestRes()

        //reduce client card balance
        const payClient = await prisma.clientCard.update({
            where: { id: card.id },
            data: { balance: card.balance - supplierPrice.price }
        })
        if (!payClient) return badRequestRes()

        //update the schedule
        const updateSchedule = await prisma.supplierSchedule.update({
            where: { id: scheduleID },
            data: {
                reserved: true
            }
        })

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const bookingID = searchParams.get('bookingID')

    const { scheduleID, supplierID, clientID, note, operator, meetingInfoID, clientCardID, status, name } = await req.json()

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!meetingInfoID) return notFoundRes('meetingInfoID')
    if (!clientCardID) return notFoundRes('clientCardiD')

    try {

        if (bookingID) {

            //check booking
            const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!booking) return notFoundRes('Booking')

            //check schedule
            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!schedule) return notFoundRes('Schedule')

            //check client
            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
            if (!client) return notFoundRes('Client')

            //check supplire
            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            //check meetinginfo
            const meetingInfo = await prisma.supplier.findUnique({ where: { id: meetingInfoID } })
            if (!meetingInfo) return notFoundRes('Meeting Info')

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID } })
            if (!supplierPrice) return notFoundRes('Supplier Price')

            //check card
            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
            if (!card) return notFoundRes('Card')
            if (card.balance < supplierPrice.price) return badRequestRes()


            //create bookign
            const createBooking = await prisma.booking.create({
                data: {
                    note, status, operator, name, price: supplierPrice.price,
                    supplierID, clientID, clientCardID, meetingInfoID, scheduleID
                }, include: { client_card: true }
            })
            if (!createBooking) return badRequestRes()

            // reduce client card balance
            const payClient = await prisma.clientCard.update({
                where: { id: createBooking.clientCardID },
                data: { balance: createBooking.client_card.balance - supplierPrice.price }
            })
            if (!payClient) return badRequestRes()

            //refund the previous client
            const refundClient = await prisma.clientCard.update({
                where: { id: booking.clientCardID },
                data: { balance: card.balance + booking.price }
            })
            if (!refundClient) return badRequestRes()

            return okayRes()

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

    try {

        if (bookingID) {

            //retrieve the booking
            const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!booking) return notFoundRes('Booking')

            //retrive the card
            const card = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!card) return notFoundRes('Client Card')

            //refund the client
            const refundClient = await prisma.clientCard.update({
                where: { id: booking.clientCardID },
                data: { balance: card?.balance + booking.price }
            })
            if (!refundClient) return badRequestRes()

            //delete the booking
            const deleteBooking = prisma.booking.delete({ where: { id: bookingID } })
            if (!deleteBooking) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('bookingID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}