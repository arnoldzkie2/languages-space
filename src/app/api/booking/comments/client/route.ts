import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { BOOKING, CLIENT, SUPPLIER } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //get bookingID in searchParameters
        const bookingID = getSearchParams(req, 'bookingID')

        if (bookingID) {

            //retrieve booking
            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                select: { client_comment: true }
            })
            if (!booking) return notFoundRes(BOOKING)

            //check if booking does not have client comments
            if (booking.client_comment.length === 0) return badRequestRes("no_comment")

            //return the comment
            return okayRes(booking.client_comment[0])
        }

        //if clientID is passed return all supplier booking comments in this client
        const clientID = getSearchParams(req, 'clientID')

        if (clientID) {
            //retrieve client
            const client = await prisma.client.findUnique({
                where: { id: clientID },
                select: {
                    bookings: {
                        select: {
                            supplier_comment: true
                        }
                    }
                }
            })
            if (!client) return notFoundRes(CLIENT)

            //this are all the comments in this client
            const modifyComments = client.bookings.map(booking => booking.supplier_comment[0])

            return okayRes(modifyComments)
        }

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //if departmentID passed return all commment comments in this department
        const departmentID = getSearchParams(req, 'departmentID')

        if (departmentID) {

            //retrieve client comments in this department
            const clientComments = await prisma.clientBookingComments.findMany({
                where: {
                    booking: {
                        department: {
                            id: departmentID
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            })
            if (!clientComments) return badRequestRes("Failed to retrieve all client comments")

            return okayRes(clientComments)
        }

        //return all client comments
        const clientComments = await prisma.clientBookingComments.findMany({
            orderBy: { created_at: 'desc' }
        })
        if (!clientComments) return badRequestRes("Failed to get all client comments")

        return okayRes(clientComments)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session || session.user.type !== CLIENT) return unauthorizedRes()
        //only allow client

        //get this data in request body
        const { rate, message, bookingID } = await req.json()

        //retrieve booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingID },
            select: { client_comment: true }
        })
        if (!booking) return notFoundRes(BOOKING)
        //return 404 if not found

        //check if booking already has comment prevent to create a new one
        if (booking.client_comment.length > 0) return badRequestRes("Booking already has comment update this instead")

        //create the booking comment and connect itto client and booking
        const createClientBookingComment = await prisma.clientBookingComments.create({
            data: {
                rate, message,
                client: { connect: { id: session.user.id } },
                booking: { connect: { id: bookingID } }
            }
        })
        if (!createClientBookingComment) return badRequestRes("Failed to create booking comment")
        //return 400 response if it fails to create

        //return 201 response
        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session || session.user.type !== CLIENT) return unauthorizedRes()
        //only allow client

        //get this data in request body
        const { rate, message, bookingID } = await req.json()

        const booking = await prisma.booking.findUnique({
            where: { id: bookingID },
            select: { client_comment: true }
        })
        if (!booking) return notFoundRes(BOOKING)
        if (booking.client_comment.length === 0) return badRequestRes("Booking does not have comment yet")
        const clientCommentID = booking.client_comment[0].id

        //retrieve comment
        const clientComment = await prisma.clientBookingComments.findUnique({
            where: {
                id: clientCommentID
            }
        })
        if (!clientComment) return notFoundRes("Comment")

        //create the booking comment and connect itto client and booking
        const updateClientBookingComment = await prisma.clientBookingComments.update({
            where: { id: clientCommentID },
            data: { rate, message }
        })
        if (!updateClientBookingComment) return badRequestRes("Failed to update comment")
        //return 400 response if it fails to create

        //return 201 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { searchParams } = new URL(req.url)
        const commmentIds = searchParams.getAll('clientCommentID')

        if (commmentIds.length > 0) {

            //delete all comments passed in searchParameters
            const deleteClientComments = await prisma.clientBookingComments.deleteMany({
                where: {
                    id: { in: commmentIds }
                }
            })
            if (!deleteClientComments) return badRequestRes("Faild to delete comments")

            return okayRes()
        }

        return notFoundRes("Client Comment")

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
