import { StatisticsChartData } from "@/app/api/overview/statistics/chart/route";
import prisma from "@/lib/db";
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";

export const getWeeklyBookingCountChart = async () => {
    const startDateCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDateCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
    const startDatePreviousWeek = startOfWeek(subWeeks(startDateCurrentWeek, 1), { weekStartsOn: 1 });
    const endDatePreviousWeek = endOfWeek(subWeeks(endDateCurrentWeek, 1), { weekStartsOn: 1 });

    const currentWeek = await prisma.booking.findMany({
        where: {
            created_at: {
                gte: startDateCurrentWeek,
                lte: endDateCurrentWeek
            }
        }
    });

    const previousWeek = await prisma.booking.findMany({
        where: {
            created_at: {
                gte: startDatePreviousWeek,
                lte: endDatePreviousWeek
            }
        }
    });

    // Initialize objects to hold booking counts for each day of the week
    const currentWeekCounts: Record<string, number> = {};
    const previousWeekCounts: Record<string, number> = {};

    // Count the number of booking for each day of the current week
    currentWeek.forEach(booking => {
        const day = format(booking.created_at, 'eeee'); // Get the day name (e.g., Monday)
        currentWeekCounts[day] = (currentWeekCounts[day] || 0) + 1;
    });

    // Count the number of booking for each day of the previous week
    previousWeek.forEach(booking => {
        const day = format(booking.created_at, 'eeee'); // Get the day name (e.g., Monday)
        previousWeekCounts[day] = (previousWeekCounts[day] || 0) + 1;
    });

    // Prepare data structure with total booking counts for each day of the current and previous week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data: StatisticsChartData[] = daysOfWeek.map(day => ({
        x: day,
        now: currentWeekCounts[day] || 0,
        prev: previousWeekCounts[day] || 0
    }));

    return data;
};

export const getMonthlyBookingCountChart = async () => {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const startDatePreviousMonth = startOfMonth(subMonths(currentDate, 1));
    const endDatePreviousMonth = endOfMonth(subMonths(currentDate, 1));

    const currentMonth = await prisma.booking.findMany({
        where: {
            created_at: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const previousMonth = await prisma.booking.findMany({
        where: {
            created_at: {
                gte: startDatePreviousMonth,
                lte: endDatePreviousMonth
            }
        }
    });

    // Count the number of booking for each day of the current month
    const currentMonthCount: Record<number, number> = {};
    currentMonth.forEach(booking => {
        const dayOfMonth = booking.created_at.getDate();
        currentMonthCount[dayOfMonth] = (currentMonthCount[dayOfMonth] || 0) + 1;
    });

    // Count the number of booking for each day of the previous month
    const previousMonthCount: Record<number, number> = {};
    previousMonth.forEach(booking => {
        const dayOfMonth = booking.created_at.getDate();
        previousMonthCount[dayOfMonth] = (previousMonthCount[dayOfMonth] || 0) + 1;
    });

    // Prepare data structure with total booking counts for each day of the current and previous month
    const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const data: StatisticsChartData[] = daysOfMonth.map(day => ({
        x: day.toString(),
        now: currentMonthCount[day] || 0,
        prev: previousMonthCount[day] || 0
    }));

    return data;
};


export const getYearlyBookingCountChart = async () => {

    // Calculate start and end dates for the current year and previous year
    const currentDate = new Date();
    const thisYear = currentDate.getFullYear();
    const startDate = new Date(thisYear, 0, 1); // January 1st of the current year
    const endDate = new Date(thisYear, 11, 31); // December 31st of the current year
    const startDatePreviousYear = new Date(thisYear - 1, 0, 1); // January 1st of the previous year
    const endDatePreviousYear = new Date(thisYear - 1, 11, 31); // December 31st of the previous year

    // Fetch booking within the current year
    const currentYear = await prisma.booking.findMany({
        where: {
            created_at: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    // Fetch booking within the previous year
    const previousYear = await prisma.booking.findMany({
        where: {
            created_at: {
                gte: startDatePreviousYear,
                lte: endDatePreviousYear
            }
        }
    });

    // Count the number of booking for each month of the current year
    const currentYearCount: Record<string, number> = {};
    currentYear.forEach(booking => {
        const month = booking.created_at.getMonth(); // Get the month index (0 for January, 1 for February, etc.)
        currentYearCount[month] = (currentYearCount[month] || 0) + 1;
    });

    // Count the number of booking for each month of the previous year
    const previousYearCount: Record<string, number> = {};
    previousYear.forEach(booking => {
        const month = booking.created_at.getMonth(); // Get the month index (0 for January, 1 for February, etc.)
        previousYearCount[month] = (previousYearCount[month] || 0) + 1;
    });

    // Prepare data structure with total booking counts for each month of the current and previous year
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data: StatisticsChartData[] = monthsOfYear.map((month, index) => ({
        x: month,
        now: currentYearCount[index] || 0,
        prev: previousYearCount[index] || 0
    }));

    return data;
};
