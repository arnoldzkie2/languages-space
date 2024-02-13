import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getBookingData = async ({ startOfMonth, endOfMonth, startOfLastMonth, endOfLastMonth }: DashboardDateType) => {
    // Calculate the number of new bookings created this month
    const numberOfNewBookingsThisMonth = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        }
    });

    // Calculate the number of new bookings created last month
    const numberOfNewBookingsLastMonth = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lt: endOfLastMonth
            }
        }
    });

    // Calculate the percentage change in the number of new bookings compared to last month
    const numberOfBookingChangesLastmonthPercentage = numberOfNewBookingsLastMonth !== 0
        ? ((numberOfNewBookingsThisMonth - numberOfNewBookingsLastMonth) / numberOfNewBookingsLastMonth) * 100
        : 0;

    return { numberOfNewBookingsThisMonth, numberOfBookingChangesLastmonthPercentage }
}