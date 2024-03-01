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
                select: { supplier_comment: true }
            })
            if (!booking) return notFoundRes(BOOKING)

            //check if booking does not have client comments
            if (booking.supplier_comment.length === 0) return badRequestRes("no_comment")

            //return the comment
            return okayRes(booking.supplier_comment[0])
        }

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //if departmentID passed return all commment comments in this department
        const departmentID = getSearchParams(req, 'departmentID')

        if (departmentID) {

            //retrieve supplier comments in this department
            const supplierComments = await prisma.supplierBookingComments.findMany({
                where: {
                    booking: {
                        department: {
                            id: departmentID
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            })
            if (!supplierComments) return badRequestRes("Failed to retrieve all supplier comments")

            return okayRes(supplierComments)
        }

        //return all supplier comments
        const supplierComments = await prisma.supplierBookingComments.findMany({
            orderBy: { created_at: 'desc' }
        })
        if (!supplierComments) return badRequestRes("Failed to get all supplier comments")

        return okayRes(supplierComments)

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
        if (!session || session.user.type !== SUPPLIER) return unauthorizedRes()
        //only allow client

        //get this data in request body
        const {
            rate,
            message,
            client_level,
            book_name,
            book_page,
            vocabulary,
            sentences,
            homework,
            bookingID

        } = await req.json()

        //retrieve booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingID },
            select: { supplier_comment: true }
        })
        if (!booking) return notFoundRes(BOOKING)
        //return 404 if not found

        //check if booking already has comment prevent to create a new one
        if (booking.supplier_comment.length > 0) return badRequestRes("Booking already has comment update this instead")

        //create the booking comment and connect itto client and booking
        const createSupplierBookingComment = await prisma.supplierBookingComments.create({
            data: {
                rate, message, client_level, book_name, book_page, vocabulary, sentences, homework,
                supplier: { connect: { id: session.user.id } },
                booking: { connect: { id: bookingID } }
            }
        })
        if (!createSupplierBookingComment) return badRequestRes("Failed to create booking comment")
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
        if (!session || session.user.type !== SUPPLIER) return unauthorizedRes()
        //only allow client

        //get this data in request body
        const {
            rate,
            message,
            client_level,
            book_name,
            book_page,
            vocabulary,
            sentences,
            homework,
            bookingID
        } = await req.json()

        const booking = await prisma.booking.findUnique({
            where: { id: bookingID },
            select: {
                supplier_comment: true
            }
        })
        if (!booking) return notFoundRes(BOOKING)

        const supplierCommentID = booking.supplier_comment[0].id
        //retrieve comment
        const supplierComment = await prisma.supplierBookingComments.findUnique({
            where: {
                id: supplierCommentID
            }
        })
        if (!supplierComment) return notFoundRes("Comment")

        //create the booking comment and connect itto client and booking
        const updateSupplierBookingComment = await prisma.supplierBookingComments.update({
            where: { id: supplierCommentID },
            data: { rate, message, client_level, book_name, book_page, sentences, homework, vocabulary }
        })
        if (!updateSupplierBookingComment) return badRequestRes("Failed to update comment")
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
        const commentIds = searchParams.getAll('supplierCommentID')

        if (commentIds.length > 0) {

            //delete all comments passed in searchParameters
            const deleteClientComments = await prisma.supplierBookingComments.deleteMany({
                where: {
                    id: { in: commentIds }
                }
            })
            if (!deleteClientComments) return badRequestRes("Failed to delete comments")

            return okayRes()
        }

        return notFoundRes("Supplier Comment")

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
