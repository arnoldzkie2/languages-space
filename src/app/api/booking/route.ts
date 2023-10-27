import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const bookingID = searchParams.get('bookingID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (bookingID) {

            const getBooking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!getBooking) return notFoundRes('Schedule')

            return okayRes(getBooking)
        }

        if (departmentID) {

            const departmentBookings = await prisma.department.findUnique({ where: { id: departmentID }, select: { bookings: true } })
            if (!departmentBookings) return notFoundRes('Department')

            return okayRes(departmentBookings)
        }

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

        const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        if (!schedule) return notFoundRes('Schedule')
        if (schedule.reserved) return NextResponse.json({ msg: 'This schedule is already reserved' }, { status: 409 })

        const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
        if (!client) return notFoundRes('Client')

        const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
        if (!supplier) return notFoundRes('Supplier')

        const meetingInfo = await prisma.supplier.findUnique({ where: { id: meetingInfoID } })
        if (!meetingInfo) return notFoundRes('Meeting Info')

        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
        if (!card) return notFoundRes('Card')

        const createBooking = await prisma.booking.create({
            data: {
                note, status, operator, name,
                supplier: { connect: { id: supplierID } },
                client: { connect: { id: clientID } },
                meeting_info: { connect: { id: meetingInfoID } },
                schedule: { connect: { id: scheduleID } },
                client_card: { connect: { id: clientCardID } }
            }
        })
        if (!createBooking) return badRequestRes()

        const payClient = await prisma.clientCard.update({
            where: { id: card.id },
            data: { balance: card.balance - 1 }
        })

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}
