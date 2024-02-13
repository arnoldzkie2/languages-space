import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getSupplierWithMostBookingLastMonth = async ({ startOfLastMonth, endOfLastMonth }: DashboardDateType) => {
    const supplierWithMostBookingsLastMonth = await prisma.supplier.findFirst({
        orderBy: {
            bookings: {
                _count: 'desc'
            }
        },
        where: {
            bookings: {
                some: {
                    created_at: {
                        gte: startOfLastMonth,
                        lt: endOfLastMonth
                    }
                }
            }
        },
        select: {
            id: true,
            username: true,
            profile_url: true,
            bookings: true,
            email: true
        }
    });

    if (!supplierWithMostBookingsLastMonth) return null
    // Calculate total bookings of the supplier with the most bookings last month
    const totalBookingsOfSupplierWithMostBookingsLastMonth = supplierWithMostBookingsLastMonth.bookings.length;

    return {
        id: supplierWithMostBookingsLastMonth.id,
        profile_url: supplierWithMostBookingsLastMonth.profile_url,
        username: supplierWithMostBookingsLastMonth.username,
        total_bookings: totalBookingsOfSupplierWithMostBookingsLastMonth,
        email: supplierWithMostBookingsLastMonth.email
    };

}