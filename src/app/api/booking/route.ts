import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const scheduleID = searchParams.get('scheduleID')

    try {

        if (scheduleID) {

            const getSchedule = await prisma.supplierSchedule.findUnique({
                where: { id: scheduleID, reserved: true }
            })

            if (!getSchedule) return notFoundRes('Schedule')

            return okayRes(getSchedule)

        }

        const allSchedule = await prisma.supplierSchedule.findMany({ where: { reserved: true } })

        if (!allSchedule) return badRequestRes()

        return okayRes(allSchedule)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }


}

export const POST = async (req: Request) => {

    const { scheduleID, supplierID, clientID, note, meeting_info, clientCardID } = await req.json()

    try {

        if (!scheduleID) return notFoundRes('scheduleID')
        if (!clientID) return notFoundRes('clientID')
        if (!supplierID) return notFoundRes('supplierID')
        if (!meeting_info) return notFoundRes('Meeting info')
        if (!clientCardID) return notFoundRes('Client Card')

        const client = await prisma.client.findUnique({ where: { id: clientID }, include: { cards: true } })

        if (!client) return notFoundRes('Client')

        const existingReservation = await prisma.supplierSchedule.findUnique({
            where: { id: scheduleID }
        })

        if (!existingReservation) return badRequestRes()

        if (existingReservation?.reserved) return NextResponse.json({ msg: 'This schedule is already reserved' }, { status: 409 })

        const clientCard = client.cards.find(card => card.id === clientCardID)

        if (!clientCard) return notFoundRes('Client Card')

        if (clientCard.balance < 1) return NextResponse.json({ msg: 'Insufficient balance' }, { status: 400 })

        const bookToTeacher = await prisma.supplierSchedule.update({
            where: { id: scheduleID },
            data: {
                client_id: clientID,
                client_name: client.name,
                note,
                reserved: true,
                meeting_info,
                client_card_id: clientCardID
            }
        })

        if (!bookToTeacher) return badRequestRes()

        const newBalance = clientCard.balance - 1
        const payClient = await prisma.clientCard.update({
            where: { id: clientCardID },
            data: { balance: newBalance }
        })

        if (!payClient) return badRequestRes()

        return okayRes()

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const scheduleID = searchParams.get('scheduleID')
    const supplierID = searchParams.get('supplierID')
    const clientID = searchParams.get('clientID')

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')

    const { meeting_info, note, completed } = await req.json()

    try {

        const schedule = await prisma.supplierSchedule.findUnique({
            where: { id: scheduleID, supplier_id: supplierID, client_id: clientID }
        })

        if (!schedule) return notFoundRes('Schedule')

        const updateSchedule = await prisma.supplierSchedule.update({
            where: { id: scheduleID, supplier_id: supplierID, client_id: clientID },
            data: { meeting_info, note, completed }
        })

        if (!updateSchedule) badRequestRes()

        return okayRes()

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const scheduleID = searchParams.get('scheduleID')
    const supplierID = searchParams.get('supplierID')
    const clientID = searchParams.get('clientID')

    try {

        if (!scheduleID) return notFoundRes('scheduleID')
        if (!supplierID) return notFoundRes('supplierID')
        if (!clientID) return notFoundRes('clientID')

        const checkBooking = await prisma.supplierSchedule.findUnique({
            where: { id: scheduleID, supplier_id: supplierID, client_id: clientID },
        })

        if (!checkBooking) return notFoundRes('Schedule')

        const cancelBooking = await prisma.supplierSchedule.update({
            where: { id: scheduleID, supplier_id: supplierID, client_id: clientID },
            data: { reserved: false, note: null, client_id: null, client_name: null, meeting_info: {}, client_card_id: null }
        })

        if (!cancelBooking) return badRequestRes()

        if (checkBooking.client_card_id) {

            const checkCard = await prisma.clientCard.findUnique({ where: { id: checkBooking.client_card_id } })

            if (!checkCard) return notFoundRes('Client Card')

            const refundClient = await prisma.clientCard.update({
                where: { id: checkCard.id },
                data: {
                    balance: checkCard?.balance + 1
                }
            })

            if (!refundClient) return badRequestRes()

            return okayRes()

        }

        return badRequestRes()

    } catch (error) {

        console.error(error);

    }

}