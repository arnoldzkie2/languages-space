import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getMostSoldCardThisMonth = async ({ startOfMonth, endOfMonth }: DashboardDateType) => {
    // Fetch the most sold card for this month based on order records
    const mostSoldCardThisMonth = await prisma.order.groupBy({
        by: ['cardID'],
        _count: {
            cardID: true
        },
        where: {
            created_at: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        },
        orderBy: {
            _count: {
                cardID: 'desc'
            }
        },
        take: 1
    });

    if (mostSoldCardThisMonth.length === 0) return null;

    // Fetch additional details of the most sold card
    const cardDetails = await prisma.clientCardList.findUnique({
        where: {
            id: mostSoldCardThisMonth[0].cardID
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
    if (!cardDetails) return null

    return cardDetails;
};
