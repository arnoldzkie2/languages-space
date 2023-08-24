import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplier_id = searchParams.get('supplier_id')
    const date = searchParams.get('date')

    try {

        const supplierSchedule = await prisma.supplierSchedule.findMany({
            where: {
                supplier_id, date: String(date)
            },
        });

        if (!supplierSchedule) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: false, data: supplierSchedule })

    } catch (error) {

        console.error('Error fetching schedules:', error);

    }

}

export const POST = async (req: Request) => {

    const { date, times, supplier_id } = await req.json()

    try {

        const checkSupplier = await prisma.supplier.findUnique({ where: { id: supplier_id } })

        if (!checkSupplier) return NextResponse.json({ success: false, error: true, message: 'No Supplier found' }, { status: 404 })

        const existingSchedules = await prisma.supplierSchedule.findMany({
            where: {
                date,
                time: { in: times },
            },
            select: {
                time: true,
            },
        });

        const existingTimes = new Set(existingSchedules.map((schedule) => schedule.time));

        // Prepare the new schedules to be created
        const newSchedules = times
            .filter((time: string) => !existingTimes.has(time))
            .map((time: string) => ({
                date, time, supplier_id
            }));

        // Create new schedules in bulk
        const createSchedules = await prisma.supplierSchedule.createMany({
            data: newSchedules,
            skipDuplicates: true,
        });

        // Check if the createMany operation was successful
        if (!createSchedules) {
            return NextResponse.json({ success: false, error: true, message: 'Server error' })
        }

        // Filter out any null values and return the successful creations

        return NextResponse.json({ success: true, error: false, data: createSchedules })

    } catch (error) {
        console.error('Error creating schedules:', error);
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (!id) return NextResponse.json({ success: false, error: true, message: 'No Schedule ID found' }, { status: 404 })

        const checkSchedule = await prisma.supplierSchedule.findUnique({ where: { id } })

        if (!checkSchedule) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        if (checkSchedule?.reserved) return NextResponse.json({ success: false, error: true, message: "This schedule is already reserved this can't be deleted." }, { status: 400 })

        const deleteSchedule = await prisma.supplierSchedule.delete({ where: { id } })

        if (!deleteSchedule) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: false, deleted: deleteSchedule }, { status: 200 })

    } catch (error) {

        console.error(error);

    }

}
