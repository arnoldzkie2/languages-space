import prisma from "@/lib/db";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse"


export const GET = async (req: Request) => {

    const supplierID = getSearchParams(req.url, 'supplierID')

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
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            supplier.schedule.sort((a, b) => {
                // Compare dates first
                const dateComparison = a.date.localeCompare(b.date);
                if (dateComparison !== 0) {
                    return dateComparison;
                }

                // If dates are equal, compare times
                return a.time.localeCompare(b.time);
            });

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