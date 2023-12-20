import prisma from "@/lib/db";
import { badRequestRes, createdRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest, NextResponse } from "next/server";

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

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, quantity, settlement } = await req.json()

    try {

        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })
        if (!card) return notFoundRes('Card')

        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID } })
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported' }, { status: 400 })

        const department = await prisma.department.findUnique({ where: { id: card?.card.departmentID } })
        if (!department) return notFoundRes('Department')

        const bookingPrice = department.name.toLocaleLowerCase() === 'fingerpower' ? quantity * card?.price! : (card?.price! / card?.card.balance!) * supplierPrice?.price!

        const createReminders = await prisma.reminders.create({
            data: {
                note, status, operator, name, price: bookingPrice, card_name: card?.name, quantity, settlement,
                supplierID, clientID, scheduleID,
                meeting_info, clientCardID, courseID,
                department: { connect: { id: card.card.departmentID } },
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

export const PATCH = async (req: NextRequest) => {

    try {
        const remindersID = getSearchParams(req, 'remindersID')
        const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, quantity, settlement } = await req.json()

        if (remindersID) {

            const reminder = await prisma.reminders.findUnique({ where: { id: remindersID } })
            if (!reminder) return notFoundRes('Reminders')

            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })
            if (!card) return notFoundRes('Card')

            const department = await prisma.department.findUnique({ where: { id: card?.card.departmentID } })
            if (!department) return notFoundRes('Department')

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID } })
            if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported' }, { status: 400 })

            const bookingPrice = department.name.toLocaleLowerCase() === 'fingerpower' ? quantity * card?.price! : (card?.price! / card?.card.balance!) * supplierPrice?.price!

            const updateReminder = await prisma.reminders.update({
                where: { id: remindersID },
                data: {
                    scheduleID, clientCardID, clientID, note, operator,
                    meeting_info, status, name, courseID, quantity, settlement,
                    price: bookingPrice
                }
            })
            if (!updateReminder) return badRequestRes()

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