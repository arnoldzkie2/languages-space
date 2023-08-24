import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export const POST = async (req: Request) => {

    const { supplier_id, fromDate, toDate } = await req.json()
0
    try {

        const schedules = await prisma.supplierSchedule.findMany({
            where: {
                supplier_id,
                date: {
                    gte: String(fromDate),
                    lte: String(toDate),
                },
            },
        });

        const groupedSchedules = schedules.reduce((acc: any, schedule) => {
            const { date } = schedule;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(schedule);
            return acc;
        }, {});

        const arrangedSchedules = Object.keys(groupedSchedules).map((date) => ({
            date,
            times: groupedSchedules[date],
        }));

        arrangedSchedules.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

        return NextResponse.json({ success: true, error: false, data: arrangedSchedules })

    } catch (error) {

        console.error('Error fetching schedules:', error);

    }

}