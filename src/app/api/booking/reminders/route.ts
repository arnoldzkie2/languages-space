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
            })
            if (!reminders) return notFoundRes('Schedule')

            return okayRes(reminders)
        }

        if (departmentID) {

            //get all reminders in department
            const departmentReminders = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    reminders: true
                }
            })
            if (!departmentReminders) return notFoundRes('Department')

            return okayRes(departmentReminders.reminders)

        }

        //get all reminders
        const reminders = await prisma.reminders.findMany()
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

    try {

        if (departmentID) {

            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, clientCardID: card?.cardID } })

            const department = await prisma.department.findUnique({ where: { id: departmentID } })
            if (!department) return notFoundRes('Department')

            if (department.name.toLocaleLowerCase() === 'fingerpower') {

                const bookingPrice = quantity * card?.price!

                //create reminders for fingerpower
                const createReminders = await prisma.reminders.create({
                    data: {
                        note, status, operator, name, price: bookingPrice, card_name: card?.name, quantity, settlement,
                        supplierID, clientID, scheduleID,
                        meeting_info, clientCardID, courseID,
                        department: { connect: { id: department.id } },
                    },
                })
                if (!createReminders) return badRequestRes()

            } else {

                const bookingPrice = (card?.price! / card?.card.balance!) * supplierPrice?.price!

                //create reminders for verbalace
                const createReminders = await prisma.reminders.create({
                    data: {
                        note, status, operator, name, price: bookingPrice, card_name: card?.name, quantity, settlement,
                        supplierID, clientID, scheduleID,
                        meeting_info, clientCardID, courseID,
                        department: { connect: { id: department.id } },
                    },
                })
                if (!createReminders) return badRequestRes()

            }

        }

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

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, departmentID, quantity, settlement } = await req.json()

    const remindersID = searchParams.get('remindersID')

    try {

        if (remindersID) {

            const reminder = await prisma.reminders.findUnique({ where: { id: remindersID } })
            if (!reminder) return notFoundRes('Reminders')

            if (departmentID) {

                const department = await prisma.department.findUnique({ where: { id: departmentID } })
                if (!department) return notFoundRes('Department')

                const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })

                const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, clientCardID: card?.cardID } })

                if (department.name.toLocaleLowerCase() === 'fingerpower') {

                    const bookingPrice = quantity * card?.card?.price!

                    const updateReminders = await prisma.reminders.update({
                        where: { id: reminder.id },
                        data: {
                            scheduleID, supplierID, clientID, note, operator, price: bookingPrice,
                            meeting_info, clientCardID, status, name, courseID,
                            departmentID, quantity, settlement, card_name: card?.name
                        }
                    })
                    if (!updateReminders) return badRequestRes()

                } else {

                    const bookingPrice = (card?.card?.price! / card?.card.balance!) * supplierPrice?.price!

                    const updateReminders = await prisma.reminders.update({
                        where: { id: reminder.id },
                        data: {
                            scheduleID, supplierID, clientID, note, operator, price: bookingPrice,
                            meeting_info, clientCardID, status, name, courseID,
                            departmentID, quantity, settlement, card_name: card?.name
                        }
                    })
                    if (!updateReminders) return badRequestRes()

                }

                return okayRes()

            }

            return notFoundRes('departmentID')

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

        if (remindersIDS.length < 1) return notFoundRes('remindersID')

        const deleteBookings = await prisma.reminders.deleteMany({
            where: { id: { in: remindersIDS } }
        })

        if (deleteBookings.count < 1) return badRequestRes()

        return okayRes(deleteBookings.count)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}