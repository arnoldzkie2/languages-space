import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const supplierID = searchParams.get('supplierID')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    try {

        if (fromDate && toDate && supplierID) {


            const schedules = await prisma.supplierSchedule.findMany({
                where: {
                    supplier_id: supplierID,
                    date: {
                        gte: fromDate,
                        lte: toDate
                    },
                },
            });

            if (!schedules) return badRequestRes()

            return okayRes(schedules)

        }

        return notFoundRes('supplierID')

    } catch (error) {

        console.error('Error fetching schedules:', error);

        return serverErrorRes()

    }

}