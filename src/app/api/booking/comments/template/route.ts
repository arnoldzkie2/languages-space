import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { BOOKING, CLIENT, SUPPLIER } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //retrieve all templates and booking
        const bookingTemplates = await prisma.bookingCommentTemplates.findMany()

        //if user is client or supplier proceed to this if statement
        if (session.user.type === CLIENT || session.user.type === SUPPLIER) {

            const bookingID = getSearchParams(req, 'bookingID')
            if (!bookingID) return notFoundRes(BOOKING)
            //return 404 if not found

            //retrieve booking and retrieve client and supplier
            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                include: {
                    supplier: true,
                    client: true
                }
            })
            if (!booking) return notFoundRes(BOOKING)
            //return 404 response if not found

            if (session.user.type === CLIENT) {

                //get this in booking
                const supplierGender = booking.supplier.gender ? booking.supplier.gender : 'others'

                //check if template user is client remove it in array or gender is not the same gender of supplier 
                const clientTemplates = bookingTemplates.filter(obj => obj.user === CLIENT && obj.gender === supplierGender)

                //modify the array remove some of the data that client don't need for faster result 
                const refactorTemplates = clientTemplates.map(template => template.message)

                //return 200 response and return the templates
                return okayRes(refactorTemplates)
            }

            //this will proceed if user is supplier
            //get this in booking
            const clientGender = booking.client.gender ? booking.supplier.gender : 'others'

            //check if template user is supplier remove it in array or gender is not the same gender of client
            const supplierTemplates = bookingTemplates.filter(obj => obj.user === SUPPLIER && obj.gender === clientGender)
            //modify the array remove some of the data that client don't need for faster result 
            const refactorTemplates = supplierTemplates.map(template => template.message)

            //return 200 response and return the templates
            return okayRes(refactorTemplates)
        }

        //here check if user is admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const templateID = getSearchParams(req, 'templateID')
        //get the bookingTemplateID in searchParams

        //if templateID exist then get that booking templates and return it
        if (templateID) {

            const template = await prisma.bookingCommentTemplates.findUnique({ where: { id: templateID } })
            if (!template) return notFoundRes("Booking Template Comment")

            return okayRes(template)
        }

        //return all templates
        return okayRes(bookingTemplates)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {
    try {

        //authorize user only allow admin to proceed
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //check if admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get the mssage,gender,user in request body
        const { message, gender, user } = await req.json()

        if (!message) return notFoundRes("Message")
        if (!gender) return notFoundRes("Gender")
        if (!user) return notFoundRes("User Type")
        //return 404 if none of this exist

        //create the template
        const createTemplate = await prisma.bookingCommentTemplates.create({
            data: { message, gender, user }
        })
        if (!createTemplate) return badRequestRes("Failed to create booking template")

        //return 201 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {
    try {

        //authorize user only allow admin to proceed
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //check if admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const templateID = getSearchParams(req, 'templateID')
        if (!templateID) return notFoundRes("Booking Template")

        //get the mssage,gender,user in request body
        const { message, gender, user } = await req.json()

        if (!message) return notFoundRes("Message")
        if (!gender) return notFoundRes("Gender")
        if (!user) return notFoundRes("User Type")
        //return 404 if none of this exist

        //retrieve template
        const template = await prisma.bookingCommentTemplates.findUnique({ where: { id: templateID } })
        if (!template) return notFoundRes("Template")

        //update the template
        const updateTemplate = await prisma.bookingCommentTemplates.update({
            where: { id: templateID },
            data: { message, gender, user }
        })
        if (!updateTemplate) return badRequestRes("Failed to update booking comment template")
        //return 400 response if it fails to update

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


export const DELETE = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only allow admin to proceed
        const { searchParams } = new URL(req.url);
        const ids = searchParams.getAll('templateID');
        //get all templateID

        if (ids.length > 0) {

            const deleteTemplates = await prisma.bookingCommentTemplates.deleteMany({
                where: { id: { in: ids } },
            })
            if (!deleteTemplates) return badRequestRes("Failed to delete Template")
            //return 400 response if it fails to delete
            if (deleteTemplates.count < 1) return notFoundRes("Template")

            //return 200 response
            return okayRes()
        }

        //return 404 response if clientID not passed
        return notFoundRes("Template")

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect();
    }
}