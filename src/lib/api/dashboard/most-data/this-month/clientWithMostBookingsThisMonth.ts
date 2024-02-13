import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getClientWithMostBookingsThisMonth = async ({ startOfMonth, endOfMonth }: DashboardDateType) => {
    // Fetch the client with the most bookings this month
    const clientWithMostBookingsThisMonth = await prisma.client.findFirst({
        orderBy: {
            bookings: {
                _count: 'desc'
            }
        },
        where: {
            bookings: {
                some: {
                    created_at: {
                        gte: startOfMonth,
                        lt: endOfMonth
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

    if (!clientWithMostBookingsThisMonth) return null;

    // Calculate total bookings of the client with the most bookings this month
    const totalBookingsOfClientWithMostBookingsThisMonth = clientWithMostBookingsThisMonth.bookings.length;
    return {
        id: clientWithMostBookingsThisMonth.id,
        profile_url: clientWithMostBookingsThisMonth.profile_url,
        username: clientWithMostBookingsThisMonth.username,
        email: clientWithMostBookingsThisMonth.email,
        total_bookings: totalBookingsOfClientWithMostBookingsThisMonth
    };
};
