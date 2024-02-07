import prisma from "@/lib/db"
import { getAuth } from "@/lib/nextAuth"
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse"
import { SUPPLIER } from "@/utils/constants"
import axios from "axios"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow supplier to proceed
        if (session.user.type !== SUPPLIER) return unauthorizedRes()

        const { note, bookingID } = await req.json()
        if (!bookingID) return notFoundRes("Booking")

        //retrieve booking
        const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
        if (!booking) return notFoundRes('Booking')
        //return 404 if not found

        //update booking status,note and operator
        const updateBooking = await prisma.booking.update({
            where: { id: booking.id }, data: {
                note, status: 'cancel-request', operator: session.user.type
            }
        })
        if (!updateBooking) return badRequestRes()
        //return 400 response if it fails

        //notify admins that supplier request to cancel a booking
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/cancel-request`, {
            bookingID: booking.id,
            operator: session.user.type
        })

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}