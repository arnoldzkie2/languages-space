import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getClientWithMostBookingsLastMonth = async ({ startOfLastMonth, endOfLastMonth }: DashboardDateType) => {
    // Fetch the client with the most bookings last month
    const clientWithMostBookingsLastMonth = await prisma.client.findFirst({
        orderBy: {
            bookings: {
                _count: 'desc'
            }
        },
        where: {
            bookings: {
                some: {
                    created_at: {
                        gte: startOfLastMonth,
                        lt: endOfLastMonth
                    }
                }
            }
        },
        select: {
            id: true,
            username: true,
            profile_url: true,
            bookings: true,
            email: true
        }
    });

    if (!clientWithMostBookingsLastMonth) return null

    // Calculate total bookings of the client with the most bookings last month
    const totalBookingsOfClientWithMostBookingsLastMonth = clientWithMostBookingsLastMonth.bookings.length;
    return {
        id: clientWithMostBookingsLastMonth.id,
        profile_url: clientWithMostBookingsLastMonth.profile_url,
        username: clientWithMostBookingsLastMonth.username,
        email: clientWithMostBookingsLastMonth.email,
        total_bookings: totalBookingsOfClientWithMostBookingsLastMonth
    };
}