import { getAgentData } from "@/lib/api/statistics/getAgentData";
import { getBookingData } from "@/lib/api/statistics/getBookingData";
import { getClientData } from "@/lib/api/statistics/getClientData";
import { getOrderData } from "@/lib/api/statistics/getOrderData";
import { getRevenueData } from "@/lib/api/statistics/getRevenueData";
import { getSupplierData } from "@/lib/api/statistics/getSupplierData";
import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { AGENT, BOOKING, CLIENT, ORDER, REVENUE, SUPPLIER } from "@/utils/constants";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { NextRequest } from "next/server";

interface OverviewCards {
    icon: IconDefinition
    name: string
    total: number;
    thisYear: number;
    thisMonth: number;
    thisWeek: number;
    oneYearChange: number;
    oneMonthChange: number;
    oneWeekChange: number;
}

export type { OverviewCards }

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const currentView = getSearchParams(req, 'currentView')
        if (!currentView) return badRequestRes("Missing Fields")

        switch (currentView) {
            case REVENUE:
                return okayRes(await getRevenueData())
            case ORDER:
                return okayRes(await getOrderData())
            case CLIENT:
                return okayRes(await getClientData())
            case SUPPLIER:
                return okayRes(await getSupplierData())
            case AGENT:
                return okayRes(await getAgentData())
            case BOOKING:
                return okayRes(await getBookingData())
            default:
                return badRequestRes("Failed to get statistics")
        }

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}