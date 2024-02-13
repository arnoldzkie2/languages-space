import prisma from "@/lib/db";
import { REVENUE } from "@/utils/constants";
import { faYenSign } from "@fortawesome/free-solid-svg-icons";

const getRevenueData = async () => {
    const today = new Date();
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfPreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

    const getTotalRevenue = await prisma.order.aggregate({
        _sum: { price: true }
    });
    const totalRevenue = Number(getTotalRevenue._sum.price);

    // Fetch total revenue (sum of order prices) for this year
    const getTotalRevenueThisYear = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfThisYear,
                lte: today
            }
        },
        _sum: { price: true }
    });
    const totalRevenueThisYear = Number(getTotalRevenueThisYear._sum.price);

    // Fetch total revenue (sum of order prices) for last year
    const getTotalRevenueLastYear = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfLastYear,
                lt: startOfThisYear
            }
        },
        _sum: { price: true }
    });
    const totalRevenueLastYear = Number(getTotalRevenueLastYear._sum.price);

    // Fetch total revenue (sum of order prices) for this week
    const getTotalRevenueThisWeek = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfThisWeek,
                lte: today
            }
        },
        _sum: { price: true }
    });
    const totalRevenueThisWeek = Number(getTotalRevenueThisWeek._sum.price);

    // Fetch total revenue (sum of order prices) for previous week
    const getTotalRevenuePreviousWeek = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfPreviousWeek,
                lt: startOfThisWeek
            }
        },
        _sum: { price: true }
    });
    const totalRevenuePreviousWeek = Number(getTotalRevenuePreviousWeek._sum.price);

    // Fetch total revenue (sum of order prices) for this month
    const getTotalRevenueThisMonth = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfThisMonth,
                lte: today
            }
        },
        _sum: { price: true }
    });
    const totalRevenueThisMonth = Number(getTotalRevenueThisMonth._sum.price);

    // Fetch total revenue (sum of order prices) for last month
    const getTotalRevenueLastMonth = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        },
        _sum: { price: true }
    });
    const totalRevenueLastMonth = Number(getTotalRevenueLastMonth._sum.price);

    // Calculate percentage change
    const revenueChangePercentageOneYear = totalRevenueLastYear
        ? ((totalRevenueThisYear - Number(totalRevenueLastYear)) / Number(totalRevenueLastYear)) * 100
        : 0;


    const revenueChangeOneMonth = totalRevenueLastMonth
        ? ((totalRevenueThisMonth - Number(totalRevenueLastMonth)) / Number(totalRevenueLastMonth)) * 100
        : 0;


    const revenueChangeThisWeek = totalRevenuePreviousWeek
        ? ((totalRevenueThisWeek - totalRevenuePreviousWeek) / totalRevenuePreviousWeek) * 100
        : 0;

    return {
        icon: faYenSign,
        name: REVENUE,
        total: totalRevenue,
        thisYear: totalRevenueThisYear,
        thisMonth: totalRevenueThisMonth,
        thisWeek: totalRevenueThisWeek,
        oneYearChange: revenueChangePercentageOneYear,
        oneMonthChange: revenueChangeOneMonth,
        oneWeekChange: revenueChangeThisWeek,
    }

};

export { getRevenueData };
