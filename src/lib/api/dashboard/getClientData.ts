import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

const getClientData = async ({ startOfLastMonth, endOfLastMonth, startOfMonth, endOfMonth }: DashboardDateType) => {
    const totalClients = await prisma.client.count();
    // Fetch total clients count for last month
    const totalClientsLastMonth = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lt: endOfLastMonth
            }
        }
    });
    const clientsChangeLastMonthPercentage = totalClientsLastMonth === 0 ? 0 : ((totalClients - totalClientsLastMonth) / totalClientsLastMonth) * 100;

    // Fetch all new clients for this month
    const numberOfNewClientsLastMonth = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lt: startOfMonth
            }
        }
    });

    const numberOfNewClientsThisMonth = await prisma.client.count({
        where: {
            created_at: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        }
    });

    // Calculate the change in the number of new clients compared to last month
    const numberOfNewClientChangesLastmonthPercentage = numberOfNewClientsLastMonth !== 0
        ? ((numberOfNewClientsThisMonth - numberOfNewClientsLastMonth) / numberOfNewClientsLastMonth) * 100
        : 0;

    return {
        totalClients,
        clientsChangeLastMonthPercentage,
        numberOfNewClientsThisMonth,
        numberOfNewClientChangesLastmonthPercentage
    }
}

export { getClientData }