import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')
    const date = searchParams.get('date')

    try {

        if (supplierID && date) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID }, include: {
                    schedule: {
                        where: {
                            supplierID, date
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.schedule)

        }

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID }, include: { schedule: true }
            })
            if (!supplier) return notFoundRes('Supplier')

            // Filter schedules to include only those starting from today onwards
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to midnight

            const filteredSchedule = supplier.schedule.filter(event => {
                const eventDate = new Date(event.date + 'T00:00:00Z'); // Assuming 'event.date' is in UTC
                eventDate.setHours(0, 0, 0, 0); // Set time to midnight
                return eventDate >= currentDate;
            });

            // Sort schedules by date and time
            const sortedSchedule = filteredSchedule.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                // Compare dates first
                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;

                // If dates are equal, compare times
                const timeA = a.time.split(':').map(Number);
                const timeB = b.time.split(':').map(Number);

                if (timeA[0] < timeB[0]) return -1;
                if (timeA[0] > timeB[0]) return 1;

                // If hours are equal, compare minutes
                if (timeA[1] < timeB[1]) return -1;
                if (timeA[1] > timeB[1]) return 1;

                return 0; // Events have the same date and time
            });

            return okayRes(sortedSchedule)
        }

        return notFoundRes('supplierID')

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

            const schedule = await prisma.supplierSchedule.findUnique({
                where: { id: scheduleID }, include: { booking: true }
            })
            if (!schedule) return badRequestRes()

            if (schedule.status === 'reserved' && schedule.booking) {

                //destruct the booking
                const { booking } = schedule

                //retrieve the client's card used in booking
                const clientCard = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
                if (!clientCard) return notFoundRes('Client Card')

                //get the supplier price to refund the client's card
                const supplierPrice = await prisma.supplierPrice.findFirst({ where: { clientCardID: clientCard.cardID, supplierID: booking.supplierID } })
                if (!supplierPrice) return NextResponse.json({ msg: 'Supplier Is Not Supported' }, { status: 409 })

                //refund the client's card by the supplier price amount
                const refundClient = await prisma.clientCard.update({
                    where: { id: booking.clientCardID },
                    data: { balance: clientCard.balance + supplierPrice.price }
                })
                if (!refundClient) return badRequestRes()

                const deleteSchedule = await prisma.supplierSchedule.delete({ where: { id: scheduleID } })
                if (!deleteSchedule) return badRequestRes()

                //delete the booking as well
                const deleteBooking = await prisma.booking.delete({ where: { id: booking.id } })
                if (!deleteBooking) return badRequestRes()

                //and return a 200 response
                return okayRes()

            }

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
