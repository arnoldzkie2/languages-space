import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, serverErrorRes } from "@/lib/utils/apiResponse";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

    const { remindersID } = await req.json()
    try {

        if (remindersID) {

            const reminder = await prisma.reminders.findUnique({
                where: { id: remindersID },
                include: {
                    supplier: true,
                    course: true,
                    client: true,
                    department: true,
                    schedule: true
                }
            })
            if (!reminder) return notFoundRes('Reminder')

            const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, price } = reminder

            if (!scheduleID) return notFoundRes('scheduleID')
            if (!supplierID) return notFoundRes('supplierID')
            if (!clientID) return notFoundRes('clientID')
            if (!meeting_info) return notFoundRes('Meeting Info')
            if (!clientCardID) return notFoundRes('clientCardiD')

            //check schedule
            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!schedule) return notFoundRes('Schedule')
            if (schedule.status === 'reserved') return NextResponse.json({ msg: 'This schedule is already reserved' }, { status: 409 })

            //check client
            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
            if (!client) return notFoundRes('Client')

            //check supplier
            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
            if (!card) return notFoundRes('Card')
            if (card.balance < price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            const currentDate = new Date();
            const cardValidityDate = new Date(card.validity);
            if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'Card is not valid' }, { status: 400 })

            //create booking
            const createBooking = await prisma.booking.create({
                data: {
                    note, status, operator, name, price,
                    supplier: { connect: { id: supplierID } },
                    client: { connect: { id: clientID } },
                    schedule: { connect: { id: scheduleID } },
                    meeting_info, clientCardID, scheduleID,
                    department: { connect: { id: client.departments[0].id } },
                    course: { connect: { id: courseID } }
                },
            })
            if (!createBooking) return badRequestRes()

            //reduce client card balance
            const payClient = await prisma.clientCard.update({
                where: { id: card.id },
                data: { balance: card.balance - price }
            })
            if (!payClient) return badRequestRes()

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

            const updateReminders = await prisma.reminders.update({ where: { id: reminder.id }, data: {status: 'booked'} })
            if(!updateReminders) return badRequestRes()

            return createdRes()

        }

        return notFoundRes('remindersID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}