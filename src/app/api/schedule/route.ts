import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')
    const date = searchParams.get('date')

    try {

        if (supplierID && date) {

            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            const supplierSchedule = await prisma.supplierSchedule.findMany({
                where: {
                    supplierID, date
                },
            })

            if (!supplierSchedule) return badRequestRes()

            return okayRes(supplierSchedule)

        }

        if (!supplierID) return notFoundRes('supplierID')

        return notFoundRes('Date')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }

}

export const POST = async (req: Request) => {

    const { dates, times, supplierID } = await req.json()

    try {

        const checkSupplier = await prisma.supplier.findUnique({ where: { id: supplierID } })

        if (!checkSupplier) return notFoundRes('Supplier')

        const existingSchedules = await prisma.supplierSchedule.findMany({
            where: {
                supplierID,
                date: { in: dates }, // Use 'in' to check against an array of dates
                time: { in: times },
            },
            select: {
                date: true, // Select the date as well for comparison
                time: true,
            },
        });

        const existingDateTimeSet = new Set(
            existingSchedules.map((schedule) => `${schedule.date}_${schedule.time}`)
        );

        const newSchedules: any = []
        // Create new schedules in bulk
        for (const date of dates) {
            for (const time of times) {
                const dateTimeKey = `${date}_${time}`;
                if (!existingDateTimeSet.has(dateTimeKey)) {
                    newSchedules.push({
                        date,
                        time,
                        supplierID,
                        status: 'available'
                    });
                }
            }
        }

        if (newSchedules.length === 0) return okayRes()

        const createSchedules = await prisma.supplierSchedule.createMany({
            data: newSchedules,
            skipDuplicates: true,
        })

        if (!createSchedules) return badRequestRes();

        return createdRes(createSchedules);

    } catch (error) {

        console.log(error);

        return serverErrorRes(error)

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const scheduleID = searchParams.get('scheduleID')

    try {

        if (scheduleID) {

            const checkSchedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!checkSchedule) return badRequestRes()
            if (checkSchedule.status === 'reserved') return NextResponse.json({ msg: "This schedule is already reserved this can't be deleted." }, { status: 400 })

            const deleteSchedule = await prisma.supplierSchedule.delete({ where: { id: scheduleID } })
            if (!deleteSchedule) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('scheduleID')

    } catch (error) {

        console.error(error);

        return serverErrorRes(error)

    }

}
