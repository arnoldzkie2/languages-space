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
            const departmentReminders = await prisma.department.findUnique({
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
            if (!departmentReminders) return notFoundRes('Department')

            return okayRes(departmentReminders.reminders)
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

        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'card expired' }, { status: 400 })

        if (department.name.toLocaleLowerCase() === 'verbalace') {

            const bookingPrice = card.price / card.card.balance

            //create reminders for verbalace
            const createBooking = await prisma.reminders.create({
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

            return createdRes()

        } else if (department.name.toLocaleLowerCase() === 'fingerpower') {

            const bookingPrice = quantity * card.price
            const createBooking = await prisma.reminders.create({
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
    const remindersID = searchParams.get('remindersID')

    try {

        if (remindersID) {

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) return notFoundRes("Department")

            //check reminders
            const reminders = await prisma.reminders.findUnique({ where: { id: remindersID } })
            if (!reminders) return notFoundRes('Booking')

            const prevCard = await prisma.clientCard.findUnique({ where: { id: reminders.clientCardID } })
            if (!prevCard) return notFoundRes('Client Card')

            const prevSupplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: reminders.supplierID, clientCardID: prevCard.cardID } })
            if (!prevSupplierPrice) return notFoundRes('Supplier Price')

            //check schedule
            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!schedule) return notFoundRes('Schedule')


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

                //update the reminders
                const updateBooking = await prisma.reminders.update({
                    where: {
                        id: remindersID
                    },
                    data: {
                        note, status, operator, name, price: bookingPrice, courseID, card_name: card.name, quantity, settlement,
                        supplierID, clientID, clientCardID, meeting_info, scheduleID, departmentID: department.id
                    }
                })
                if (!updateBooking) return badRequestRes()

                return okayRes()

            } else if (department.name.toLocaleLowerCase() === 'fingerpower') {

                const bookingPrice = quantity * card.price

                const updateBooking = await prisma.reminders.update({
                    where: {
                        id: remindersID
                    },
                    data: {
                        note, status, operator, name, price: bookingPrice, courseID, card_name: card.name, quantity, settlement,
                        supplierID, clientID, clientCardID, meeting_info, scheduleID, departmentID: department.id
                    }
                })
                if (!updateBooking) return badRequestRes()

                return okayRes()

            } else {
                return badRequestRes()
            }
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
    const remindersID = searchParams.get('remindersID')
    const remindersIDS = searchParams.getAll('remindersID')
    const type = searchParams.get('type')

    try {

        if (remindersIDS.length < 1) return notFoundRes('remindersID')
        if (!type) return notFoundRes('Type')

        if (type === 'delete') {

            const deleteBookings = await prisma.reminders.deleteMany({
                where: { id: { in: remindersIDS } }
            })

            return okayRes(deleteBookings.count)

        }

        if (type === 'cancel') {

            if (remindersID) {

                const reminders = await prisma.reminders.findUnique({ where: { id: remindersID } })
                if (!reminders) return notFoundRes('Booking')

                //retrieve client card
                const clientCard = await prisma.clientCard.findUnique({ where: { id: reminders.clientCardID } })
                if (!clientCard) return notFoundRes('Client Card')

                //refund the client
                const refundClient = await prisma.clientCard.update({
                    where: { id: clientCard.id },
                    data: { balance: clientCard.balance + reminders.price }
                })
                if (!refundClient) return badRequestRes()

                // update the reminders status to canceled
                const cancelBooking = await prisma.reminders.update({
                    where: {
                        id: remindersID
                    }, data: { status: 'canceled' }
                })
                if (!cancelBooking) return badRequestRes()

                //update the schedule status to canceled
                const updateSchedule = await prisma.supplierSchedule.update({
                    where: {
                        id: reminders.scheduleID
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