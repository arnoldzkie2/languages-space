import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, serverErrorRes, unauthorizedRes, okayRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { NextRequest } from "next/server";
import { getYearlyRevenueChart, getWeeklyRevenueChart, getMonthlyRevenueChart } from "@/lib/api/statistics/chart/getRevenueChart";
import { getMonthlyOrderCountChart, getWeeklyOrderCountChart, getYearlyOrderCountChart } from "@/lib/api/statistics/chart/getOrderChart";
import { getMonthlyBookingCountChart, getWeeklyBookingCountChart, getYearlyBookingCountChart } from "@/lib/api/statistics/chart/getBookingChart";
import { getMonthlyClientCountChart, getWeeklyClientCountChart, getYearlyClientCountChart } from "@/lib/api/statistics/chart/getClientChart";
import { getMonthlySupplierCountChart, getWeeklySupplierCountChart, getYearlySupplierCountChart } from "@/lib/api/statistics/chart/getSupplierChart";
import { getMonthlyAgentCountChart, getWeeklyAgentCountChart, getYearlyAgentCountChart } from "@/lib/api/statistics/chart/getAgentChart";

interface StatisticsChartData {
    x: string;
    now: number;
    prev: number;
}

export type { StatisticsChartData }

interface ChartFunctions {
    [key: string]: {
        [key: string]: () => Promise<StatisticsChartData[]>;
    };
}


const chartFunctions: ChartFunctions = {
    revenue: {
        week: getWeeklyRevenueChart,
        month: getMonthlyRevenueChart,
        year: getYearlyRevenueChart
    },
    order: {
        week: getWeeklyOrderCountChart,
        month: getMonthlyOrderCountChart,
        year: getYearlyOrderCountChart
    },
    booking: {
        week: getWeeklyBookingCountChart,
        month: getMonthlyBookingCountChart,
        year: getYearlyBookingCountChart
    },
    client: {
        week: getWeeklyClientCountChart,
        month: getMonthlyClientCountChart,
        year: getYearlyClientCountChart
    },
    supplier: {
        week: getWeeklySupplierCountChart,
        month: getMonthlySupplierCountChart,
        year: getYearlySupplierCountChart
    },
    agent: {
        week: getWeeklyAgentCountChart,
        month: getMonthlyAgentCountChart,
        year: getYearlyAgentCountChart
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuth();
        if (!session) return unauthorizedRes();

        // Only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type);
        if (!isAdmin) return unauthorizedRes();

        const currentChart = getSearchParams(req, 'currentChart');
        const dateFormat = getSearchParams(req, 'dateFormat');

        if (!currentChart || !dateFormat) return badRequestRes("Missing Fields");

        console.log(currentChart, dateFormat)

        const chartFunction = chartFunctions[currentChart as string]?.[dateFormat as string];

        if (!chartFunction) return badRequestRes("Chart does not exist");

        const chartData = await chartFunction();

        return okayRes(chartData)
        // switch (currentChart) {
        //     case REVENUE:
        //         switch (dateFormat) {
        //             case WEEK:
        //                 return okayRes(await getWeeklyRevenueChart())
        //             case MONTH:
        //                 return okayRes(await getMonthlyRevenueChart())
        //             case YEAR:
        //                 return okayRes(await getYearlyRevenueChart())
        //         }
        //     case ORDER:
        //         switch (dateFormat) {
        //             case WEEK:
        //                 return okayRes(await getWeeklyOrderCountChart())
        //             case MONTH:
        //                 return okayRes(await getMonthlyOrderCountChart())
        //             case YEAR:
        //                 return okayRes(await getYearlyOrderCountChart())
        //         }
        //     case BOOKING:
        //         switch (dateFormat) {
        //             case WEEK:
        //                 return okayRes(await getWeeklyBookingCountChart())
        //             case MONTH:
        //                 return okayRes(await getMonthlyBookingCountChart())
        //             case YEAR:
        //                 return okayRes(await getYearlyBookingCountChart())
        //         }
        //     case CLIENT:
        //         switch (dateFormat) {
        //             case WEEK:
        //                 return okayRes(await getWeeklyClientCountChart())
        //             case MONTH:
        //                 return okayRes(await getMonthlyClientCountChart())
        //             case YEAR:
        //                 return okayRes(await getYearlyClientCountChart())
        //         }
        //     case SUPPLIER:
        //         switch (dateFormat) {
        //             case WEEK:
        //                 return okayRes(await getWeeklySupplierCountChart())
        //             case MONTH:
        //                 return okayRes(await getMonthlySupplierCountChart())
        //             case YEAR:
        //                 return okayRes(await getYearlySupplierCountChart())
        //         }
        //     case AGENT:
        //         switch (dateFormat) {
        //             case WEEK:
        //                 return okayRes(await getWeeklyAgentCountChart())
        //             case MONTH:
        //                 return okayRes(await getMonthlyAgentCountChart())
        //             case YEAR:
        //                 return okayRes(await getYearlyAgentCountChart())
        //         }
        //     default:
        //         return badRequestRes("Chart does not exist")
        // }

    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
};
