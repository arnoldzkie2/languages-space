import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { IconDefinition, faBook, faNewspaper, faUser, faUsers, faYenSign } from '@fortawesome/free-solid-svg-icons';
import { getRevenueData } from "@/lib/api/dashboard/getRevenueData";
import { getClientData } from "@/lib/api/dashboard/getClientData";
import { getBookingData } from "@/lib/api/dashboard/getBookingData";
import { getAuth } from "@/lib/nextAuth";
import { checkIsAdmin } from "@/utils/checkUser";
import { getOrderData } from "@/lib/api/dashboard/getOrderData";
import { getAgentWithMostInvitesLastMOnth } from "@/lib/api/dashboard/most-data/last-month/getAgentWithMostInvitesLastMonth";
import { getClientWithMostBookingsLastMonth } from "@/lib/api/dashboard/most-data/last-month/getClientWithMostBookingLastMonth";
import { getSupplierWithMostBookingLastMonth } from "@/lib/api/dashboard/most-data/last-month/getSupplierWithMostBookingLastMonth";
import { getMostSoldCardLastMonth } from "@/lib/api/dashboard/most-data/last-month/getMostSoldCardLastMonth";
import { getClientWithMostBookingsThisMonth } from "@/lib/api/dashboard/most-data/this-month/clientWithMostBookingsThisMonth";
import { getSupplierWithMostBookingThisMonth } from "@/lib/api/dashboard/most-data/this-month/getSupplierWithMostBookingThisMonth";
import { getAgentWithMostInvitesThisMonth } from "@/lib/api/dashboard/most-data/this-month/agentWithMostInvitesThisMonth";
import { getMostSoldCardThisMonth } from "@/lib/api/dashboard/most-data/this-month/getMostSoldCardThisMonth";

interface MostData {
    clientMostBookings: {
        id: string;
        profile_url: string | null;
        username: string;
        total_bookings: number;
        email: string | null
    } | null
    supplierMostBookings: {
        id: string;
        profile_url: string | null;
        username: string;
        email: string | null
        total_bookings: number;
    } | null
    agentMostInvites: {
        id: string;
        profile_url: string | null;
        username: string;
        email: string | null;
        total_invites: number;
    } | null
    mostCardSold: {
        price: any;
        id: string;
        name: string;
        balance: number;
        validity: number;
        sold: number;
    } | null
}

interface DashboardDataProps {
    dashboardMetrics: ({
        name: string;
        value: number;
        icon: IconDefinition;
        changePercentage: number;
    })[];
    mostData: {
        lastMonth: MostData,
        thisMonth: MostData
    }

}


interface DashboardDateType {
    startOfLastMonth?: Date
    endOfLastMonth?: Date
    startOfMonth?: Date
    endOfMonth?: Date
}

export type { DashboardDataProps, DashboardDateType };

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        const {
            totalRevenue,
            revenueChangeLastMonthPercentage
        } = await getRevenueData({ startOfLastMonth, endOfLastMonth })

        const {
            totalClients,
            clientsChangeLastMonthPercentage,
            numberOfNewClientChangesLastmonthPercentage,
            numberOfNewClientsThisMonth
        } = await getClientData({ startOfLastMonth, endOfLastMonth, endOfMonth, startOfMonth })

        const { numberOfNewBookingsThisMonth,
            numberOfBookingChangesLastmonthPercentage
        } = await getBookingData({ startOfLastMonth, startOfMonth, endOfLastMonth, endOfMonth })

        const { totalOrdersThisMonth,
            ordersChangeLastMonthPercentage
        } = await getOrderData({ startOfLastMonth, endOfLastMonth, endOfMonth, startOfMonth })


        //fetch most Data last month
        const [clientWithMostBookingsLastMonth,
            agentWithMostInvitesLastMonth,
            supplierWithMostBookingLastMonth,
            cardMostSoldLastMonth,
            clientWithMostBookingThisMonth,
            supplierWithMostBookingThisMonth,
            agentWithMostInvitesThisMonth,
            cardMostSoldThisMonth
        ] = await Promise.all([
            getClientWithMostBookingsLastMonth({ startOfLastMonth, endOfLastMonth }),
            getAgentWithMostInvitesLastMOnth({ startOfLastMonth, endOfLastMonth }),
            getSupplierWithMostBookingLastMonth({ startOfLastMonth, endOfLastMonth }),
            getMostSoldCardLastMonth({ startOfLastMonth, endOfLastMonth }),
            getClientWithMostBookingsThisMonth({ startOfMonth, endOfMonth }),
            getSupplierWithMostBookingThisMonth({ startOfMonth, endOfMonth }),
            getAgentWithMostInvitesThisMonth({ startOfMonth, endOfMonth }),
            getMostSoldCardThisMonth({ startOfMonth, endOfMonth })
        ])

        //fetch most Data this month



        const dashboardMetrics = [
            { icon: faYenSign, name: "total_revenue", value: totalRevenue, changePercentage: revenueChangeLastMonthPercentage },
            { icon: faBook, name: "bookings", value: numberOfNewBookingsThisMonth, changePercentage: numberOfBookingChangesLastmonthPercentage },
            { icon: faNewspaper, name: "orders", value: totalOrdersThisMonth, changePercentage: ordersChangeLastMonthPercentage },
            { icon: faUser, name: "total_clients", value: totalClients, changePercentage: clientsChangeLastMonthPercentage },
            { icon: faUser, name: 'new_clients', value: numberOfNewClientsThisMonth, changePercentage: numberOfNewClientChangesLastmonthPercentage }
        ];

        // Construct the dashboard data object
        const dashboardData: DashboardDataProps = {
            dashboardMetrics,
            mostData: {
                lastMonth: {
                    clientMostBookings: clientWithMostBookingsLastMonth,
                    supplierMostBookings: supplierWithMostBookingLastMonth,
                    agentMostInvites: agentWithMostInvitesLastMonth,
                    mostCardSold: cardMostSoldLastMonth
                },
                thisMonth: {
                    clientMostBookings: clientWithMostBookingThisMonth,
                    supplierMostBookings: supplierWithMostBookingThisMonth,
                    agentMostInvites: agentWithMostInvitesThisMonth,
                    mostCardSold: cardMostSoldThisMonth
                }
            }
        };

        return okayRes(dashboardData);
    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
};

