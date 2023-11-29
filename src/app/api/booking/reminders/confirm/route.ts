import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, serverErrorRes } from "@/utils/apiResponse";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

    const { remindersID } = await req.json()
    try {

        if (remindersID) {

            const reminder = await prisma.reminders.findUnique({
                where: { id: remindersID },
                include: {
                    department: true,
                }
            })
            if (!reminder) return notFoundRes('Reminder')

            const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, departmentID, quantity, settlement } = reminder

            if (!scheduleID) return notFoundRes('Schedule')
            if (!supplierID) return notFoundRes('Supplier')
            if (!clientID) return notFoundRes('Client')
            if (!meeting_info) return notFoundRes('Meeting Info')
            if (!clientCardID) return notFoundRes('Client Card')
            if (!departmentID) return notFoundRes('Department')
            if (!settlement) return notFoundRes('Seetlement period')
            if (!courseID) return notFoundRes('Course')

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) return notFoundRes('Department')

            const course = await prisma.courses.findUnique({ where: { id: courseID } })
            if (!course) return notFoundRes('Course')

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

            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })
            if (!card) return notFoundRes('Card')

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, clientCardID: card.cardID } })
            if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' }, { status: 400 })
            if (card.balance < supplierPrice.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            const currentDate = new Date();
            const cardValidityDate = new Date(card.validity);
            if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'This card is expired' }, { status: 400 })

            if (department.name.toLocaleLowerCase() === 'fingerpower') {

                const bookingPrice = Number(quantity) * card.card.price

                //create booking
                const createBooking = await prisma.booking.create({
                    data: {
                        note, status, operator, name, price: bookingPrice,
                        card_name: card.name, quantity, settlement,
                        supplier: { connect: { id: supplierID } },
                        client: { connect: { id: clientID } },
                        schedule: { connect: { id: scheduleID } },
                        meeting_info, clientCardID, scheduleID,
                        department: { connect: { id: departmentID } },
                        course: { connect: { id: courseID } }
                    },
                })
                if (!createBooking) return badRequestRes()

            } else {

                const bookingPrice = (card.card.price / card.card.balance) * supplierPrice.price

                //create booking
                const createBooking = await prisma.booking.create({
                    data: {
                        note, status, operator, name, price: bookingPrice, card_name: card.name, quantity, settlement,
                        supplier: { connect: { id: supplierID } },
                        client: { connect: { id: clientID } },
                        schedule: { connect: { id: scheduleID } },
                        meeting_info, clientCardID, scheduleID,
                        department: { connect: { id: departmentID } },
                        course: { connect: { id: courseID } }
                    },
                })
                if (!createBooking) return badRequestRes()

                //reduce client card balance
                const payClient = await prisma.clientCard.update({
                    where: { id: card.id },
                    data: { balance: card.balance - supplierPrice.price }
                })
                if (!payClient) return badRequestRes()

            }

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

            const updateReminders = await prisma.reminders.update({ where: { id: reminder.id }, data: { status: 'booked' } })
            if (!updateReminders) return badRequestRes()

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