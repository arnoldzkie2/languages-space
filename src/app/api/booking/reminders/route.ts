import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { FINGERPOWER } from "@/utils/constants";
import { calculateCommissionPriceQuantitySettlementAndStatus } from "@/utils/getBookingPrice";
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
            if (!reminders) return notFoundRes('Reminder')

            return okayRes(reminders)
        }

        if (departmentID) {

            //get all reminders in department
            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    reminders: true
                }
            })
            if (!department) return notFoundRes('Department')

            return okayRes(department.reminders)

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

    const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, client_quantity, supplier_quantity, settlement } = await req.json()

    try {

        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })

        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID }, include: { supplier: { include: { balance: true } } } })

        const department = card && await prisma.department.findUnique({ where: { id: card?.card.departmentID } })

        const bookingPrice = department?.name.toLocaleLowerCase() === FINGERPOWER
            ? Number(client_quantity) * Number(card?.price)
            : (Number(card?.price) / card?.balance!) * Number(supplierPrice?.price);

        const createReminders = await prisma.reminders.create({
            data: {
                note, status, operator, name, price: bookingPrice, card_name: card?.name,
                settlement,
                client_quantity: Number(client_quantity),
                supplier_quantity: Number(supplier_quantity),
                supplierID, clientID, scheduleID,
                meeting_info, clientCardID, courseID,
            },
        })
        if (!createReminders) return badRequestRes()

        if (department) {
            const updateReminder = await prisma.reminders.update({
                where: { id: createReminders.id }, data: {
                    department: { connect: { id: department.id } }
                }
            })
            if(!updateReminder) return badRequestRes("Faild to update department in reminder")
        }

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

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const remindersID = getSearchParams(req, 'remindersID')
        const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, supplier_quantity, client_quantity, settlement } = await req.json()

        if (remindersID) {

            const reminder = await prisma.reminders.findUnique({ where: { id: remindersID } })
            if (!reminder) return notFoundRes('Reminders')

            const card = await prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })

            const department = card && await prisma.department.findUnique({ where: { id: card?.card.departmentID } })

            const supplierPrice = await prisma.supplierPrice.findFirst({
                where: { supplierID, cardID: card?.cardID },
                include: { supplier: { include: { balance: true } } }
            })
            if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported' }, { status: 400 })

            const bookingPrice = department?.name.toLocaleLowerCase() === FINGERPOWER
                ? Number(client_quantity) * Number(card?.price)
                : (Number(card?.price) / card?.balance!) * Number(supplierPrice?.price);

            const updateReminder = await prisma.reminders.update({
                where: { id: remindersID },
                data: {
                    scheduleID, clientCardID, clientID, note, operator,
                    meeting_info, status, name, courseID,supplierID,
                    client_quantity: Number(client_quantity),
                    supplier_quantity: Number(supplier_quantity), settlement,
                    price: bookingPrice, departmentID: department?.id
                }
            })
            if (!updateReminder) return badRequestRes()

            return okayRes()
        }

        return notFoundRes('Reminders')

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