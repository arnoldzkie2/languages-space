import prisma from "@/lib/db";
import { BOOKING } from "@/utils/constants";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const getBookingData = async () => {
    const today = new Date();
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfPreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

    // Fetch total number of bookings
    const getTotalBookings = await prisma.booking.count();

    // Fetch total number of bookings for this year
    const getTotalBookingsThisYear = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfThisYear,
                lte: today
            }
        }
    });

    // Fetch total number of bookings for last year
    const getTotalBookingsLastYear = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfLastYear,
                lt: startOfThisYear
            }
        }
    });

    // Fetch total number of bookings for this month
    const getTotalBookingsThisMonth = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfThisMonth,
                lte: today
            }
        }
    });

    // Fetch total number of bookings for last month
    const getTotalBookingsLastMonth = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        }
    });

    // Fetch total number of bookings for this week
    const getTotalBookingsThisWeek = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfThisWeek,
                lte: today
            }
        }
    });

    // Fetch total number of bookings for previous week
    const getTotalBookingsPreviousWeek = await prisma.booking.count({
        where: {
            created_at: {
                gte: startOfPreviousWeek,
                lt: startOfThisWeek
            }
        }
    });

    // Calculate percentage change for one year, one month, and one week
    const bookingsChangePercentageOneYear = getTotalBookingsLastYear
        ? ((getTotalBookingsThisYear - getTotalBookingsLastYear) / getTotalBookingsLastYear) * 100
        : 0;

    const bookingsChangePercentageOneMonth = getTotalBookingsLastMonth
        ? ((getTotalBookingsThisMonth - getTotalBookingsLastMonth) / getTotalBookingsLastMonth) * 100
        : 0;

    const bookingsChangePercentageOneWeek = getTotalBookingsPreviousWeek
        ? ((getTotalBookingsThisWeek - getTotalBookingsPreviousWeek) / getTotalBookingsPreviousWeek) * 100
        : 0;

    return {
        icon: faCalendarAlt,
        name: BOOKING,
        total: getTotalBookings,
        thisYear: getTotalBookingsThisYear,
        thisMonth: getTotalBookingsThisMonth,
        thisWeek: getTotalBookingsThisWeek,
        oneYearChange: bookingsChangePercentageOneYear,
        oneMonthChange: bookingsChangePercentageOneMonth,
        oneWeekChange: bookingsChangePercentageOneWeek
    };
};

export { getBookingData };
