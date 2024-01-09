import prisma from "@/lib/db"
import { getAuth } from "@/lib/nextAuth"
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {

        const { note, bookingID }: { note: string, bookingID: string } = await req.json()

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (session.user.type !== 'client') return unauthorizedRes()
        if (!bookingID) return notFoundRes("Booking")

        const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
        if (!booking) return notFoundRes('Booking')
        if (!note) return badRequestRes()

        const truncatedNote = note.slice(0, 180);

        const updateBooking = await prisma.booking.update({
            where: { id: booking.id }, data: {
                note: truncatedNote, status: 'cancel-request', operator: 'client'
            }
        })
        if (!updateBooking) return badRequestRes()

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}