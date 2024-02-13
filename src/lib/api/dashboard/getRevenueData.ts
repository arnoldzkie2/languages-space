// Fetch total revenue (sum of order prices)
import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

const getRevenueData = async ({ startOfLastMonth, endOfLastMonth }: DashboardDateType) => {

    const getTotalRevenue = await prisma.order.aggregate({
        _sum: { price: true }
    });
    const totalRevenue = Number(getTotalRevenue._sum.price);

    // Calculate total revenue and percentage change from last month
    const lastMonthRevenue = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lt: endOfLastMonth
            }
        },
        _sum: {
            price: true
        }
    });
    const revenueChangeLastMonthPercentage = totalRevenue && lastMonthRevenue._sum.price
        ? ((totalRevenue - Number(lastMonthRevenue._sum.price)) / Number(lastMonthRevenue._sum.price)) * 100
        : 0; // Default to 0% if data for last month is not available or totalRevenue is 0

    return {
        totalRevenue, revenueChangeLastMonthPercentage
    }

}

export { getRevenueData }