import { StatisticsChartData } from "@/app/api/overview/statistics/chart/route";
import prisma from "@/lib/db";
import { endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear, subMonths, subWeeks, subYears } from "date-fns";

export const getWeeklyRevenueChart = async () => {
    const currentDate = new Date()
    // Calculate start and end dates for the current and previous week
    const startDateCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDateCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
    const startDatePreviousWeek = startOfWeek(subWeeks(startDateCurrentWeek, 1), { weekStartsOn: 1 });
    const endDatePreviousWeek = endOfWeek(subWeeks(endDateCurrentWeek, 1), { weekStartsOn: 1 });

    // Fetch orders within the current week
    const currentWeekOrders = await prisma.order.findMany({
        where: {
            created_at: {
                gte: startDateCurrentWeek,
                lte: endDateCurrentWeek
            }
        },
        select: {
            price: true,
            created_at: true
        }
    });

    // Calculate total revenue for each day of the current week
    const currentWeekRevenue: Record<string, number> = {};
    currentWeekOrders.forEach(order => {
        const day = format(order.created_at, 'eeee'); // Get the day name (e.g., Monday)
        currentWeekRevenue[day] = (currentWeekRevenue[day] || 0) + Number(order.price);
    });

    // Fetch orders within the previous week
    const previousWeekOrders = await prisma.order.findMany({
        where: {
            created_at: {
                gte: startDatePreviousWeek,
                lte: endDatePreviousWeek
            }
        },
        select: {
            price: true,
            created_at: true
        }
    });

    // Calculate total revenue for each day of the previous week
    const previousWeekRevenue: Record<string, number> = {};
    previousWeekOrders.forEach(order => {
        const day = format(order.created_at, 'eeee'); // Get the day name (e.g., Monday)
        previousWeekRevenue[day] = (previousWeekRevenue[day] || 0) + Number(order.price);
    });

    // Prepare data structure with total revenue for each day of the current and previous week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data: StatisticsChartData[] = daysOfWeek.map(day => ({
        x: day,
        now: currentWeekRevenue[day] || 0,
        prev: previousWeekRevenue[day] || 0
    }));

    return data
}

export const getMonthlyRevenueChart = async () => {
    // Calculate start and end dates for the current month and previous month
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const startDatePreviousMonth = startOfMonth(subMonths(currentDate, 1));
    const endDatePreviousMonth = endOfMonth(subMonths(currentDate, 1));

    // Fetch orders within the current month
    const currentMonthOrders = await prisma.order.findMany({
        where: {
            created_at: {
                gte: startDate,
                lte: endDate
            }
        },
        select: {
            price: true,
            created_at: true
        }
    });

    // Fetch orders within the previous month
    const previousMonthOrders = await prisma.order.findMany({
        where: {
            created_at: {
                gte: startDatePreviousMonth,
                lte: endDatePreviousMonth
            }
        },
        select: {
            price: true,
            created_at: true
        }
    });

    // Calculate total revenue for each day of the current month
    const currentMonthRevenue: Record<number, number> = {};
    currentMonthOrders.forEach(order => {
        const dayOfMonth = order.created_at.getDate();
        currentMonthRevenue[dayOfMonth] = (currentMonthRevenue[dayOfMonth] || 0) + Number(order.price);
    });

    // Calculate total revenue for each day of the previous month
    const previousMonthRevenue: Record<number, number> = {};
    previousMonthOrders.forEach(order => {
        const dayOfMonth = order.created_at.getDate();
        previousMonthRevenue[dayOfMonth] = (previousMonthRevenue[dayOfMonth] || 0) + Number(order.price);
    });

    // Prepare data structure with total revenue for each day of the current and previous month
    const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const data: StatisticsChartData[] = daysOfMonth.map(day => ({
        x: day.toString(),
        now: currentMonthRevenue[day] || 0,
        prev: previousMonthRevenue[day] || 0
    }));

    return data;
};

export const getYearlyRevenueChart = async () => {
    // Calculate start and end dates for the current year and previous year
    const currentDate = new Date();
    const startDate = startOfYear(currentDate);
    const endDate = endOfYear(currentDate);
    const startDatePreviousYear = startOfYear(subYears(currentDate, 1));
    const endDatePreviousYear = endOfYear(subYears(currentDate, 1));

    // Fetch orders within the current year
    const currentYearOrders = await prisma.order.findMany({
        where: {
            created_at: {
                gte: startDate,
                lte: endDate
            }
        },
        select: {
            price: true,
            created_at: true
        }
    });

    // Fetch orders within the previous year
    const previousYearOrders = await prisma.order.findMany({
        where: {
            created_at: {
                gte: startDatePreviousYear,
                lte: endDatePreviousYear
            }
        },
        select: {
            price: true,
            created_at: true
        }
    });

    // Calculate total revenue for each month of the current year
    const monthlyRevenue: Record<string, number> = {};
    currentYearOrders.forEach(order => {
        const month = format(order.created_at, 'MMMM'); // Get the month name (e.g., January)
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.price);
    });

    // Calculate total revenue for each month of the previous year
    const monthlyRevenuePreviousYear: Record<string, number> = {};
    previousYearOrders.forEach(order => {
        const month = format(order.created_at, 'MMMM'); // Get the month name (e.g., January)
        monthlyRevenuePreviousYear[month] = (monthlyRevenuePreviousYear[month] || 0) + Number(order.price);
    });

    // Prepare data structure with total revenue for each month of the current and previous year
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const data: StatisticsChartData[] = monthsOfYear.map(month => ({
        x: month,
        now: monthlyRevenue[month] || 0,
        prev: monthlyRevenuePreviousYear[month] || 0
    }));

    return data;
};