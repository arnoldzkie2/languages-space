import { checkBookingAndUpdateStatus } from "@/lib/api/updateBookingStatus";
import prisma from "@/lib/db";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const supplierID = getSearchParams(req, 'supplierID')
        const date = getSearchParams(req, 'date')

        if (supplierID && date) {

            await checkBookingAndUpdateStatus()

            const today = new Date()
            const formattedCurrentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getUTCMinutes().toString().padStart(2, '0')}`; 

            const schedule = await prisma.supplierSchedule.findMany({
                where: {
                    supplierID, date, time: {
                        gte: formattedCurrentTime
                    }, status: 'available'
                },
                select: {
                    id: true,
                    time: true
                },
                orderBy: { time: 'asc' }
            })
            if (schedule.length === 0) return NextResponse.json({ msg: 'Supplier does not have available schedule in this date' }, { status: 404 })

            return okayRes(schedule)
        }

        return notFoundRes("Supplier")
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}