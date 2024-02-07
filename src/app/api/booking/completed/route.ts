import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { COMPLETED, CONFIRMED, FINGERPOWER } from "@/utils/constants";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const bookingIds: string[] = await req.json()

        const bookings = await prisma.booking.findMany({
            where: {
                id: { in: bookingIds },
                department: {
                    name: FINGERPOWER
                }
            },
            include: { supplier: { include: { balance: true } }, department: true }
        })
        if (!bookings) return badRequestRes("Failed to get selected bookings")

        const hasUncompletedBooking = bookings.some((booking) => booking.status !== CONFIRMED)
        if (hasUncompletedBooking) return badRequestRes("You can only mark a booking completed if the the status is confirmed.")

        const currentDate = new Date();
        const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
        const currentYear = currentDate.getUTCFullYear();
        // Construct the start and end dates in ISO format
        const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

        await Promise.all(bookings.map(async (booking) => {

            const balance = booking.supplier.balance[0]

            //update the booking
            const updateBooking = await prisma.booking.update({
                where: { id: booking.id }, data: {
                    status: COMPLETED
                }
            })

            //if this booking is on fingerpower then give supplier commission
            if (booking.department.name.toLocaleLowerCase() === FINGERPOWER) {

                const [updateSupplierBalance, earnings] = await Promise.all([
                    prisma.supplierBalance.update({
                        //apply the booking rate to supplier balance
                        where: { id: balance.id },
                        data: {
                            amount: Number(balance.amount) + Number(booking.supplier_rate)
                        }
                    }),
                    prisma.supplierEarnings.findFirst({
                        //retrieve earnings for this month
                        where:
                        {
                            supplierBalanceID: balance.id,
                            rate: Number(booking.supplier_rate),
                            created_at: {
                                gte: startDate.toISOString(),
                                lt: endDate.toISOString(),
                            },
                        }
                    }),
                    prisma.booking.update({
                        where: { id: booking.id }, data: {
                            status: COMPLETED
                        }
                    })
                ])
                if (!updateSupplierBalance) return badRequestRes("Faild to get supplier balance")
                if (!updateBooking) return badRequestRes("Failed to update booking")

                //if earnings this month exist update the earnings instead of creating a new data
                if (earnings) {
                    const updateSupplierEarnings = await prisma.supplierEarnings.update({
                        where: { id: earnings.id },
                        data: {
                            amount: Number(earnings.amount) + Number(booking.supplier_rate),
                            quantity: earnings.quantity + 1
                        }
                    })
                    if (!updateSupplierEarnings) return badRequestRes()
                } else {
                    //if there's no earnings for this month then create one
                    const createEarnings = await prisma.supplierEarnings.create({
                        data: {
                            name: 'Class Fee',
                            balance: { connect: { id: balance.id } },
                            amount: booking.supplier_rate,
                            quantity: 1,
                            rate: booking.supplier_rate,
                        }
                    })
                    if (!createEarnings) return badRequestRes()
                }
            }

        }))

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}