import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { ADMIN, CANCELED, SUPERADMIN } from "@/utils/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        //authorize user
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //get the current operator
        const operator = session.user.type === SUPERADMIN ? ADMIN : session.user.type

        const { bookingRequestID } = await req.json()
        if (!bookingRequestID) return notFoundRes("Booking Request")
        //return 404 respone if not found

        //retrieve the booking request
        const bookingRequest = await prisma.bookingRequest.findUnique({
            where: { id: bookingRequestID }, include: {
                client: true,
                supplier: true,
            }
        })
        if (!bookingRequest) return notFoundRes("Booking Request")
        if (bookingRequest.status === CANCELED) return NextResponse.json({ msg: "Booking request already cancelled" }, { status: 400 })
        //return 404 respone if not found

        //cancel the booking request
        const cancelBookingRequest = await prisma.bookingRequest.update({
            where: { id: bookingRequestID }, data: {
                operator, status: CANCELED
            }
        })
        if (!cancelBookingRequest) return badRequestRes("Failed to update booking request")
        //return 400 respone if it fails

        const [course, meetingInfo, card] = await Promise.all([
            prisma.courses.findUnique({ where: { id: bookingRequest.courseID } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: bookingRequest.meetingInfoID } }),
            prisma.clientCard.findUnique({ where: { id: bookingRequest.clientCardID } })
        ])
        if (!course || !meetingInfo || !card) return badRequestRes()

        //refund client card balance
        const refundClientCard = await prisma.clientCard.update({
            where: { id: card.id }, data: {
                balance: card.balance + bookingRequest.card_balance_cost
            }
        })
        if (!refundClientCard) return badRequestRes("Failed to refund client")

        //notify client and supplier that says booking request is canceled
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/request/canceled`, {
            operator,
            supplierEmail: bookingRequest.supplier.email,
            supplierName: bookingRequest.supplier.name,
            clientName: bookingRequest.client.name,
            clientEmail: bookingRequest.client.email,
            date: bookingRequest.date,
            time: bookingRequest.time,
            course: course.name,
            meetingInfo,
            price: bookingRequest.card_balance_cost,
            cardBalance: card.balance,
            cardName: card.name
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