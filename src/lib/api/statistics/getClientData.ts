import prisma from "@/lib/db";
import { CLIENT } from "@/utils/constants";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const getClientData = async () => {
    const today = new Date();
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfPreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

    // Fetch total number of clients
    const getTotalClients = await prisma.client.count();

    // Fetch total number of clients for this year
    const getTotalClientsThisYear = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfThisYear,
                lte: today
            }
        }
    });

    // Fetch total number of clients for last year
    const getTotalClientsLastYear = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfLastYear,
                lt: startOfThisYear
            }
        }
    });

    // Fetch total number of clients for this month
    const getTotalClientsThisMonth = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfThisMonth,
                lte: today
            }
        }
    });

    // Fetch total number of clients for last month
    const getTotalClientsLastMonth = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        }
    });

    // Fetch total number of clients for this week
    const getTotalClientsThisWeek = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfThisWeek,
                lte: today
            }
        }
    });

    // Fetch total number of clients for previous week
    const getTotalClientsPreviousWeek = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfPreviousWeek,
                lt: startOfThisWeek
            }
        }
    });

    // Calculate percentage change for one year, one month, and one week
    const clientsChangePercentageOneYear = getTotalClientsLastYear
        ? ((getTotalClientsThisYear - getTotalClientsLastYear) / getTotalClientsLastYear) * 100
        : 0;

    const clientsChangePercentageOneMonth = getTotalClientsLastMonth
        ? ((getTotalClientsThisMonth - getTotalClientsLastMonth) / getTotalClientsLastMonth) * 100
        : 0;

    const clientsChangePercentageOneWeek = getTotalClientsPreviousWeek
        ? ((getTotalClientsThisWeek - getTotalClientsPreviousWeek) / getTotalClientsPreviousWeek) * 100
        : 0;

    return {
        icon: faUser,
        name: CLIENT,
        total: getTotalClients,
        thisYear: getTotalClientsThisYear,
        thisMonth: getTotalClientsThisMonth,
        thisWeek: getTotalClientsThisWeek,
        oneYearChange: clientsChangePercentageOneYear,
        oneMonthChange: clientsChangePercentageOneMonth,
        oneWeekChange: clientsChangePercentageOneWeek
    };
};

export { getClientData };