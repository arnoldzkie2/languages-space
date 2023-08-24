import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { schedule_id, supplier_id, client_id, note } = await req.json()

    try {

        if (!schedule_id) return NextResponse.json({ success: false, error: true, message: 'No Teacher Schedule ID provided' }, { status: 404 })
        if (!client_id) return NextResponse.json({ success: false, error: true, message: 'No Student ID provided' }, { status: 404 })
        if (!supplier_id) return NextResponse.json({ success: false, error: true, message: 'No Supplier ID provided' }, { status: 404 })

        const checkStudent = await prisma.client.findUnique({ where: { id: client_id } })

        if (!checkStudent) return NextResponse.json({ success: false, error: true, message: 'No Student found' }, { status: 404 })

        const existingReservation = await prisma.supplierSchedule.findUnique({
            where: { id: schedule_id }
        })

        if (existingReservation?.reserved) return NextResponse.json({ success: false, error: true, message: 'This schedule is already reserved' }, { status: 409 })

        const bookToTeacher = await prisma.supplierSchedule.update({

            where: { id: schedule_id, supplier_id }, data: { client_id, client_name: checkStudent.name, note, reserved: true }

        })

        if (!bookToTeacher) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: false, data: bookToTeacher })

    } catch (error) {

        console.error(error);

    }
}

export const PATCH = async (req: Request) => {

    const { schedule_id, supplier_id, client_id } = await req.json()

    try {

        const checkBooking = await prisma.supplierSchedule.findUnique({
            where: { id: schedule_id, supplier_id, client_id },
        })

        if (!checkBooking) return NextResponse.json({ success: false, error: true, message: 'This schedule does not exist or not reserved' }, { status: 404 })

        const cancelBooking = await prisma.supplierSchedule.update({
            where: { id: schedule_id, supplier_id, client_id }, data: { reserved: false, note: null, client_id: null, client_name: null }
        })

        if (!cancelBooking) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: false, data: cancelBooking })

    } catch (error) {

        console.error(error);

    }
    
}