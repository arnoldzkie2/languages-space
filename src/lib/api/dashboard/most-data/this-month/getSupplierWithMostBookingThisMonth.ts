import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getSupplierWithMostBookingThisMonth = async ({ startOfMonth, endOfMonth }: DashboardDateType) => {
    const supplierWithMostBookingsThisMonth = await prisma.supplier.findFirst({
        orderBy: {
            bookings: {
                _count: 'desc'
            }
        },
        where: {
            bookings: {
                some: {
                    created_at: {
                        gte: startOfMonth,
                        lt: endOfMonth
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

    if (!supplierWithMostBookingsThisMonth) return null;

    // Calculate total bookings of the supplier with the most bookings this month
    const totalBookingsOfSupplierWithMostBookingsThisMonth = supplierWithMostBookingsThisMonth.bookings.length;

    return {
        id: supplierWithMostBookingsThisMonth.id,
        profile_url: supplierWithMostBookingsThisMonth.profile_url,
        username: supplierWithMostBookingsThisMonth.username,
        total_bookings: totalBookingsOfSupplierWithMostBookingsThisMonth,
        email: supplierWithMostBookingsThisMonth.email
    };
};
