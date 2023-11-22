import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const remindersID = searchParams.get('remindersID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (remindersID) {

            //check reminders
            const reminders = await prisma.reminders.findUnique({
                where: { id: remindersID },
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
            if (!reminders) return notFoundRes('Schedule')

            return okayRes(reminders)
        }

        if (departmentID) {

            //get all reminders in department
            const departmentBookings = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    reminders: {
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

            return okayRes(departmentBookings.reminders)
        }

        //get all reminders
        const reminders = await prisma.reminders.findMany({
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
        if (!reminders) return badRequestRes()

        return okayRes(reminders)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: Request) => {

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, price } = await req.json()

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!clientCardID) return notFoundRes('clientCardiD')

    try {

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
        if (card.balance < price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'Card is not valid' }, { status: 400 })

        //create reminders
        const createReminders = await prisma.reminders.create({
            data: {
                note, status, operator, name, price, card_name: card.name,
                supplier: { connect: { id: supplierID } },
                client: { connect: { id: clientID } },
                schedule: { connect: { id: scheduleID } },
                meeting_info, clientCardID, scheduleID,
                department: { connect: { id: card.card.departmentID } },
                course: { connect: { id: courseID } }
            },
        })
        if (!createReminders) return badRequestRes()

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
    const remindersID = searchParams.get('remindersID')

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, price } = await req.json()

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!clientCardID) return notFoundRes('clientCardiD')

    try {

        if (remindersID) {

            //check reminders
            const reminders = await prisma.reminders.findUnique({ where: { id: remindersID } })
            if (!reminders) return notFoundRes('Booking')

            const prevCard = await prisma.clientCard.findUnique({ where: { id: reminders.clientCardID } })
            if (!prevCard) return notFoundRes('Client Card')

            //check schedule
            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!schedule) return notFoundRes('Schedule')

            //check client
            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
            if (!client) return notFoundRes('Client')

            //check supplier
            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            //check card
            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })
            if (!card) return notFoundRes('Card')

            //retrieve the price
            if (card.balance < price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            //update the reminders
            const updateReminders = await prisma.reminders.update({
                where: {
                    id: remindersID
                },
                data: {
                    note, status, operator, name, price, courseID, card_name: card.name,
                    supplierID, clientID, clientCardID, meeting_info, scheduleID, departmentID: card.card.departmentID
                }
            })
            if (!updateReminders) return badRequestRes()

            return okayRes()
        }

        return notFoundRes('remindersID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const remindersIDS = searchParams.getAll('remindersID')

    try {

        if (remindersIDS.length > 0) {

            const deleteBookings = await prisma.reminders.deleteMany({
                where: { id: { in: remindersIDS } }
            })
            if (deleteBookings.count === 0) return badRequestRes()

            return okayRes(deleteBookings.count)
        }

        return notFoundRes('remindersID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}