import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { BOOKING, CLIENT, ORDER, SUPPLIER } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuth();
        if (!session) return unauthorizedRes();

        // Only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type);
        if (!isAdmin) return unauthorizedRes();

        const currentChart = getSearchParams(req, 'chart');
        if (!currentChart) return notFoundRes("Chart");

        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 6); // Subtract 9 days to get a 10-day range

        if (currentChart !== 'revenue') {

            // Fetch data based on the currentChart parameter
            const data = await fetchChartData(currentChart, oneWeekAgo, today);
            if (!data) return notFoundRes("Data");

            // Aggregate data by day
            const dataByDay: { [date: string]: number } = {};
            data.forEach(item => {
                const itemDate = new Date(item.created_at).toLocaleDateString();
                if (!dataByDay[itemDate]) {
                    dataByDay[itemDate] = 0;
                }
                dataByDay[itemDate] += 1; // Assuming each item counts as 1, modify accordingly if it's not the case
            });

            // Create the array of objects with day and total
            const chartData = Array.from({ length: 7 }, (_, index) => {
                const currentDate = new Date(oneWeekAgo);
                currentDate.setDate(oneWeekAgo.getDate() + index); // Increment date by index
                const currentDateString = currentDate.toLocaleDateString();
                return {
                    day: getDayName(currentDate.getDay()),
                    total: dataByDay[currentDateString] || 0
                };
            });

            //return the chartData
            return okayRes(chartData);

        } else {

            const revenueByDay = await prisma.order.groupBy({
                by: ['created_at'],
                where: {
                    created_at: {
                        gte: oneWeekAgo,
                        lt: today,
                    },
                },
                _sum: {
                    price: true,
                },
            });

            const formattedRevenueByDay = Array.from({ length: 7 }, (_, index) => {
                const currentDate = new Date(oneWeekAgo);
                currentDate.setDate(oneWeekAgo.getDate() + index); // Increment date by index
                const currentDay = getDayName(currentDate.getDay());

                // Find all orders made on the current day
                const ordersOnDay = revenueByDay.filter(entry => {
                    const entryDate = new Date(entry.created_at);
                    return (
                        entryDate.getDate() === currentDate.getDate() &&
                        entryDate.getMonth() === currentDate.getMonth() &&
                        entryDate.getFullYear() === currentDate.getFullYear()
                    );
                });

                // Calculate total revenue for the current day by summing up the prices of all orders
                const total = ordersOnDay.reduce((acc, entry) => acc + (Number(entry._sum?.price) || 0), 0);

                return {
                    day: currentDay,
                    total,
                };
            });

            return okayRes(formattedRevenueByDay);
        }

    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        await prisma.$disconnect();
    }
};

// Function to fetch data based on the current chart type
const fetchChartData = async (chartType: string, startDate: Date, endDate: Date) => {
    switch (chartType) {
        case CLIENT:
            return await prisma.client.findMany({
                where: {
                    created_at: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            })
        case ORDER:
            return await prisma.order.findMany({
                where: {
                    created_at: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            })
        case BOOKING:
            return await prisma.booking.findMany({
                where: {
                    created_at: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            })
        default:
            return null
    }
};

// Function to get the name of the day from its numeric representation
const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
};
