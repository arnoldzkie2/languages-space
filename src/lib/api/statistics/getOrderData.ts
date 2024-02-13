import prisma from "@/lib/db";
import { ORDER } from "@/utils/constants";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

const getOrderData = async () => {
    const today = new Date();
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfPreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

    // Fetch total number of orders
    const getTotalOrders = await prisma.order.count();

    // Fetch total number of orders for this year
    const getTotalOrdersThisYear = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfThisYear,
                lte: today
            }
        }
    });

    // Fetch total number of orders for last year
    const getTotalOrdersLastYear = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfLastYear,
                lt: startOfThisYear
            }
        }
    });

    // Fetch total number of orders for this month
    const getTotalOrdersThisMonth = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfThisMonth,
                lte: today
            }
        }
    });

    // Fetch total number of orders for last month
    const getTotalOrdersLastMonth = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        }
    });

    // Fetch total number of orders for this week
    const getTotalOrdersThisWeek = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfThisWeek,
                lte: today
            }
        }
    });

    // Fetch total number of orders for previous week
    const getTotalOrdersPreviousWeek = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfPreviousWeek,
                lt: startOfThisWeek
            }
        }
    });

    // Calculate percentage change for one year, one month, and one week
    const ordersChangePercentageOneYear = getTotalOrdersLastYear
        ? ((getTotalOrdersThisYear - getTotalOrdersLastYear) / getTotalOrdersLastYear) * 100
        : 0;

    const ordersChangePercentageOneMonth = getTotalOrdersLastMonth
        ? ((getTotalOrdersThisMonth - getTotalOrdersLastMonth) / getTotalOrdersLastMonth) * 100
        : 0;

    const ordersChangePercentageOneWeek = getTotalOrdersPreviousWeek
        ? ((getTotalOrdersThisWeek - getTotalOrdersPreviousWeek) / getTotalOrdersPreviousWeek) * 100
        : 0;

    return {
        icon: faNewspaper,
        name: ORDER,
        total: getTotalOrders,
        thisYear: getTotalOrdersThisYear,
        thisMonth: getTotalOrdersThisMonth,
        thisWeek: getTotalOrdersThisWeek,
        oneYearChange: ordersChangePercentageOneYear,
        oneMonthChange: ordersChangePercentageOneMonth,
        oneWeekChange: ordersChangePercentageOneWeek
    };
};

export { getOrderData };
