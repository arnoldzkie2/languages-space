import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { BOOKING, DEPARTMENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        //auth
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //only allow admin to proceed here
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const bookingID = getSearchParams(req, 'bookingID')
        const departmentID = getSearchParams(req, 'departmentID')
        //if bookingID is passed retrieve it and return the comments from supplier and client
        if (bookingID) {

            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                select: {
                    client_comment: true,
                    supplier_comment: true
                }
            })
            if (!booking) return notFoundRes(BOOKING)
            //return 404 if not found

            //return 200 response and pass the comments
            return okayRes(booking)
        }

        //if departmentID is passed return all booking comments in this department
        if (departmentID) {
            const department = await prisma.department.findUnique({
                where: { id: departmentID },
                select: {
                    bookings: {
                        select: {
                            id: true,
                            schedule: true,
                            supplier: {
                                select: {
                                    name: true
                                }
                            },
                            client: {
                                select: {
                                    username: true
                                }
                            },
                            supplier_comment: {
                                select: {
                                    book_name: true,
                                    book_page: true,
                                    rate: true,
                                    message: true,
                                    client_level: true
                                }
                            },
                            client_comment: {
                                select: {
                                    rate: true,
                                    message: true
                                }
                            }
                        },
                        orderBy: {
                            created_at: 'desc'
                        }
                    }
                }
            })
            if (!department) return notFoundRes(DEPARTMENT)

            return okayRes(department.bookings)
        }

        //return all evaluation
        const booking = await prisma.booking.findMany({
            where: {
                supplier_comment: {},
                client_comment: {}
            },
            select: {
                id: true,
                schedule: true,
                supplier: {
                    select: {
                        name: true
                    }
                },
                client: {
                    select: {
                        username: true
                    }
                },
                supplier_comment: {
                    select: {
                        book_name: true,
                        book_page: true,
                        rate: true,
                        message: true,
                        client_level: true
                    }
                },
                client_comment: {
                    select: {
                        rate: true,
                        message: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })
        if (!booking) return badRequestRes("Failed to get all comments")

        return okayRes(booking)

    } catch (error) {
        console.error(error);
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
        const ids = searchParams.getAll('bookingID');
        //get all bookingID

        if (ids.length > 0) {

            const [deleteSupplierComments, deleteClientComments] = await Promise.all([
                prisma.supplierBookingComments.deleteMany({
                    where: {
                        booking: {
                            id: { in: ids }
                        }
                    },
                }),
                prisma.clientBookingComments.deleteMany({
                    where: {
                        booking: {
                            id: { in: ids }
                        }
                    },
                })
            ])
            if (!deleteSupplierComments || deleteClientComments) return badRequestRes("Failed to delete Comments")

            //return 200 response
            return okayRes()
        }

        //return 404 response if clientID not passed
        return notFoundRes(BOOKING)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect();
    }
}