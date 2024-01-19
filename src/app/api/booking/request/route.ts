import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { ADMIN, CLIENT, DEPARTMENT, PENDING, SUPERADMIN, SUPPLIER } from "@/utils/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        //only client are allowed to
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === CLIENT) {
            //retrieve client booking requests
            const client = await prisma.client.findUnique({
                where: { id: session.user.id },
                select: {
                    booking_request: {
                        select: {
                            id: true,
                            note: true,
                            status: true,
                            card_name: true,
                            time: true,
                            date: true,
                            created_at: true,
                            supplier: {
                                select: {
                                    name: true
                                }
                            },
                        },
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!client) return notFoundRes('Client')
            //return 404 response if client not found

            //return 200 resposne and return client booking_requests
            return okayRes(client.booking_request)
        }

        if (session.user.type === SUPPLIER) {
            //retrieve supplire booking requests
            const supplier = await prisma.supplier.findUnique({
                where: { id: session.user.id }, select: {
                    booking_request: {
                        select: {
                            note: true,
                            id: true,
                            status: true,
                            card_name: true,
                            time: true,
                            date: true,
                            created_at: true,
                            client: {
                                select: {
                                    name: true
                                }
                            }
                        },
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!supplier) return notFoundRes(SUPPLIER)
            //return 404 response if supplier not found

            //return 200 response and return supplier booking_requests
            return okayRes(supplier.booking_request)
        }

        //only allow admin to proceed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get the departmentID in search paramteres
        const departmentID = getSearchParams(req, 'departmentID')

        if (departmentID) {

            //if departmentID passed return all boooking requests in department
            const department = await prisma.department.findUnique({
                where: { id: departmentID },
                select: {
                    booking_requests: {
                        include: {
                            client: {
                                select: {
                                    username: true
                                }
                            },
                            supplier: {
                                select: {
                                    name: true
                                }
                            }
                        },
                        orderBy: { created_at: 'desc' }
                    }
                }
            })
            if (!department) return notFoundRes(DEPARTMENT)
            //return 404 response if department not found

            //return 200 response and return all booking requests in order in department
            return okayRes(department.booking_requests)
        }

        //return all booking requests in order
        const allBookingRequest = await prisma.bookingRequest.findMany({
            include: {
                client: {
                    select: {
                        username: true
                    }
                },
                supplier: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        })
        if (!allBookingRequest) return badRequestRes("Failed to get all booking request")

        //return 200 response and passed allBookingRequest
        return okayRes(allBookingRequest)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {

    try {

        //authorize user
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        const { note, date, time, supplierID, clientCardID, meetingInfoID, courseID, clientID } = await req.json()

        if (!date || !time || !supplierID || !clientCardID || !meetingInfoID || !courseID || !clientID) return badRequestRes("Missing Data")

        //return admin if operator is super-admin
        const operator = session.user.type === SUPERADMIN ? ADMIN : session.user.type

        //get the client,supplier and meetingInfo all at once
        const [client, supplier, meetingInfo, course, card] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } }),
            prisma.courses.findUnique({ where: { id: courseID } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } })
        ])
        //return 404 response if some of this does not exist
        if (!client) return notFoundRes(CLIENT)
        if (!supplier) return notFoundRes(SUPPLIER)
        if (!meetingInfo) return notFoundRes("Meeting Info")
        if (!course) return notFoundRes('Course')
        if (!card) return notFoundRes("Client Card")

        //get the booking card price
        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: supplier.id, cardID: card.cardID } })

        //check if supplier is supported in this card or not
        if (!supplierPrice) return NextResponse.json({ msg: "Supplier is not supported in this card" }, { status: 400 })
        //check if card used in this booking has enough balance to book
        if (Number(card.price) < supplierPrice.price) return badRequestRes("Card don't have enough balance to request a booking")

        //get the current Date and compare the schedule date
        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        const scheduleDate = new Date(`${date}T${time}`);

        console.log(currentDate)
        console.log(scheduleDate)
        //check if client card is expired or schedule is passed
        if (currentDate > cardValidityDate || currentDate > scheduleDate) {
            return NextResponse.json(
                {
                    msg: currentDate > cardValidityDate ? 'Card is expired' : 'This schedule already passed',
                },
                { status: 400 }
            );
        }

        //get the date with this format 2023-11-22 (YEAR-MONTH-DAY)
        const today = new Date().toISOString().split('T')[0];

        if (date === today) {
            // Check if the booking time is at least 3 hours ahead
            const bookingTime = new Date(`${date}T${time}`);
            const minimumBookingTime = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);

            if (bookingTime < minimumBookingTime) {
                return NextResponse.json(
                    {
                        msg: 'Booking schedule must be at least 3 hours ahead of the current time.',
                    },
                    { status: 400 }
                )
            }
        }

        //create a booking request and update client card balance
        const [createBookingRequest, updateClientCardBalance] = await Promise.all([
            prisma.bookingRequest.create({
                data: {
                    note, date, time, clientCardID, meetingInfoID, card_name: card.name,
                    courseID, status: PENDING, operator, card_balance_cost: supplierPrice.price,
                    client: { connect: { id: client.id } },
                    supplier: { connect: { id: supplier.id } },
                    department: { connect: { id: card.card.departmentID } }
                }
            }),
            prisma.clientCard.update({
                where: { id: card.id }, data: { balance: card.balance - supplierPrice.price }
            })
        ])
        if (!createBookingRequest) return badRequestRes("Failed to create booking request")
        if (!updateClientCardBalance) return badRequestRes("Failed to update client card balance")
        //return 400 response if it fails

        //notify the supplier and client
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/request`, {
            clientName: client.name,
            supplierName: supplier.name,
            supplierEmail: supplier.email,
            clientEmail: client.email,
            cardName: card.name,
            cardBalance: card.balance,
            price: supplierPrice.price,
            date,
            time,
            course: course.name,
            meetingInfo,
            operator
        })

        //return 201 response
        return createdRes()

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
        //only allow admin to delete a booking request
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { searchParams } = new URL(req.url)
        const requestBookingIds = searchParams.getAll('boookingRequestID')

        if (requestBookingIds.length > 0) {

            const deleteBookingRequests = await prisma.bookingRequest.deleteMany({
                where: { id: { in: requestBookingIds } }
            })
            if (!deleteBookingRequests) return badRequestRes()

            return okayRes()
        }

        return notFoundRes("Booking Request")

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}