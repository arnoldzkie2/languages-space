import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getMostSoldCardLastMonth = async ({ startOfLastMonth, endOfLastMonth }: DashboardDateType) => {
    // Fetch the most sold card last month
    const mostSoldCardLastMonth = await prisma.clientCardList.findFirst({
        orderBy: {
            sold: 'desc'
        },
        where: {
            created_at: {
                gte: startOfLastMonth,
                lt: endOfLastMonth
            }
        },
        select: {
            id: true,
            name: true,
            sold: true,
            price: true,
            validity: true,
            balance: true
        }
    });

    if (!mostSoldCardLastMonth) return null

    return mostSoldCardLastMonth
}