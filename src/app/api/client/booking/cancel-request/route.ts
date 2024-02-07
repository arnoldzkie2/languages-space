import prisma from "@/lib/db"
import { getAuth } from "@/lib/nextAuth"
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse"
import { CLIENT } from "@/utils/constants"
import axios from "axios"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {

        const { note, bookingID }: { note: string, bookingID: string } = await req.json()

        const session = await getAuth()
        if (!session || session.user.type !== CLIENT) return unauthorizedRes()

        if (!bookingID) return notFoundRes("Booking")
        if (!note) return notFoundRes("Note")

        //retrieve booking
        const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
        if (!booking) return notFoundRes('Booking')

        //only allowed 180 characters
        const truncatedNote = note.slice(0, 180);

        //update booking
        const updateBooking = await prisma.booking.update({
            where: { id: booking.id }, data: {
                note: truncatedNote, status: 'cancel-request', operator: CLIENT
            }
        })
        if (!updateBooking) return badRequestRes()
        //return 400 response if fails


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