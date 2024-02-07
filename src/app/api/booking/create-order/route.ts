import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { ADMIN, COMPLETED, FINGERPOWER } from "@/utils/constants";
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
            },
            include: { department: true, schedule: true, client: true }
        })
        if (!bookings) return badRequestRes("Failed to get selected bookings")
        const hasUncompletedBooking = bookings.some((booking) => booking.status !== COMPLETED || booking.note === 'order created' || booking.department.name !== FINGERPOWER)
        if (hasUncompletedBooking) return badRequestRes("You can only create an order if booking is in fingerpower department,booking is completed and booking doesn't have order created.")

        const card = await prisma.clientCard.findUnique({ where: { id: bookings[0].clientCardID } })
        if (!card) return notFoundRes("Card")

        bookings.sort((a: any, b: any) => a.schedule.date - b.schedule.date);

        const oldestDate = bookings[0].schedule.date;
        const newestDate = bookings[bookings.length - 1].schedule.date;
        const totalPrice: number = bookings.reduce((sum, booking) => sum + Number(booking.price), 0);

        const createOrder = await prisma.order.create({
            data: {
                quantity: 1,
                operator: ADMIN,
                status: COMPLETED,
                note: 'booking completed',
                price: totalPrice,
                cardID: card.cardID,
                name: `${bookings[0].client.name}, ${bookings[0].name} from ${oldestDate} to ${newestDate}`,
                departments: { connect: { id: bookings[0].departmentID } },
                client: { connect: { id: bookings[0].clientID } }
            }
        })
        if (!createOrder) return badRequestRes("Failed to create order")

        // Update the status of all bookings to "completed"
        const updateBookings = await prisma.booking.updateMany({
            where: {
                id: { in: bookingIds }
            },
            data: {
                note: 'order created'
            }
        });
        if (!updateBookings) return badRequestRes("Failed to update bookings")

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
