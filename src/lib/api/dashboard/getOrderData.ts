import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getOrderData = async ({ startOfLastMonth, endOfLastMonth, endOfMonth, startOfMonth }: DashboardDateType) => {
    // Fetch total orders count for this month
    const totalOrdersThisMonth = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        }
    });

    // Fetch total orders count for last month
    const totalOrdersLastMonth = await prisma.order.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lt: endOfLastMonth
            }
        }
    });

    // Calculate the percentage change in orders compared to last month
    const ordersChangeLastMonthPercentage = totalOrdersLastMonth !== 0
        ? ((totalOrdersThisMonth - totalOrdersLastMonth) / totalOrdersLastMonth) * 100
        : 0;

    return { totalOrdersThisMonth, ordersChangeLastMonthPercentage }
}