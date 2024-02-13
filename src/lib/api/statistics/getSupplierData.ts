import prisma from "@/lib/db";
import { SUPPLIER } from "@/utils/constants";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const getSupplierData = async () => {
    const today = new Date();
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfPreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

    // Fetch total number of suppliers
    const getTotalSuppliers = await prisma.supplier.count();

    // Fetch total number of suppliers for this year
    const getTotalSuppliersThisYear = await prisma.supplier.count({
        where: {
            created_at: {
                gte: startOfThisYear,
                lte: today
            }
        }
    });

    // Fetch total number of suppliers for last year
    const getTotalSuppliersLastYear = await prisma.supplier.count({
        where: {
            created_at: {
                gte: startOfLastYear,
                lt: startOfThisYear
            }
        }
    });

    // Fetch total number of suppliers for this month
    const getTotalSuppliersThisMonth = await prisma.supplier.count({
        where: {
            created_at: {
                gte: startOfThisMonth,
                lte: today
            }
        }
    });

    // Fetch total number of suppliers for last month
    const getTotalSuppliersLastMonth = await prisma.supplier.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        }
    });

    // Fetch total number of suppliers for this week
    const getTotalSuppliersThisWeek = await prisma.supplier.count({
        where: {
            created_at: {
                gte: startOfThisWeek,
                lte: today
            }
        }
    });

    // Fetch total number of suppliers for previous week
    const getTotalSuppliersPreviousWeek = await prisma.supplier.count({
        where: {
            created_at: {
                gte: startOfPreviousWeek,
                lt: startOfThisWeek
            }
        }
    });

    // Calculate percentage change for one year, one month, and one week
    const suppliersChangePercentageOneYear = getTotalSuppliersLastYear
        ? ((getTotalSuppliersThisYear - getTotalSuppliersLastYear) / getTotalSuppliersLastYear) * 100
        : 0;

    const suppliersChangePercentageOneMonth = getTotalSuppliersLastMonth
        ? ((getTotalSuppliersThisMonth - getTotalSuppliersLastMonth) / getTotalSuppliersLastMonth) * 100
        : 0;

    const suppliersChangePercentageOneWeek = getTotalSuppliersPreviousWeek
        ? ((getTotalSuppliersThisWeek - getTotalSuppliersPreviousWeek) / getTotalSuppliersPreviousWeek) * 100
        : 0;

    return {
        icon: faUsers,
        name: SUPPLIER,
        total: getTotalSuppliers,
        thisYear: getTotalSuppliersThisYear,
        thisMonth: getTotalSuppliersThisMonth,
        thisWeek: getTotalSuppliersThisWeek,
        oneYearChange: suppliersChangePercentageOneYear,
        oneMonthChange: suppliersChangePercentageOneMonth,
        oneWeekChange: suppliersChangePercentageOneWeek
    };
};

export { getSupplierData };
