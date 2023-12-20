import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse"
import { NextRequest } from "next/server";


export const GET = async (req: NextRequest) => {

    const supplierID = getSearchParams(req, 'supplierID')

    try {

        if (supplierID) {

            const today = new Date();  // Get the current date and time in UTC

            const formattedToday = today.toISOString().split('T')[0];  // Format the date as "YYYY-MM-DD"
            const formattedCurrentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getUTCMinutes().toString().padStart(2, '0')}`;  // Format the time as "HH:mm"

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID }, select: {
                    schedule: {
                        where: {
                            status: 'available',
                            date: { gte: formattedToday },
                            time: { gte: formattedCurrentTime }  // Schedule time is later than or equal to the current time
                        },
                        orderBy: [
                            { date: 'asc' },
                            { time: 'asc' }
                        ]
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.schedule)

        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const formattedOneYearAgo = oneYearAgo.toISOString().split('T')[0];

            await prisma.supplierSchedule.deleteMany({
                where: {
                    supplierID: session.user.id,
                    date: {
                        lte: formattedOneYearAgo
                    },
                    status: 'available',
                    booking: {
                        none: {}
                    }
                }
            });

            return okayRes();
        }

        return badRequestRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
};
