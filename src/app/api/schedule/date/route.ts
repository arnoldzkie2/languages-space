import prisma from "@/lib/db"
import { getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const supplierID = getSearchParams(req, 'supplierID')
    const fromDate = getSearchParams(req, 'fromDate')
    const toDate = getSearchParams(req, 'toDate')

    try {

        if (fromDate && toDate && supplierID) {

            const schedule = await prisma.supplierSchedule.findMany({
                select: {
                    id: true,
                    time: true,
                    booking: {
                        select: { id: true }
                    },
                    date: true,
                    clientUsername: true,
                    status: true,
                },
                where: {
                    supplierID, date: {
                        gte: fromDate,
                        lte: toDate
                    }
                }
            })
            if (!schedule) return notFoundRes('Supplier')

            return okayRes(schedule)
        }

        if (!fromDate || !toDate) return notFoundRes('Date')

        return notFoundRes('Supplier')

    } catch (error) {
        console.error('Error fetching schedules:', error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}