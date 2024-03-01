import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { getAuth } from "@/lib/nextAuth";
import { ADMIN, AVAILABLE, CANCELED, CLIENT, DEPARTMENT, FINGERPOWER, RESERVED, SUPERADMIN, VERBALACE } from "@/utils/constants";
import axios from "axios";
import { checkIsAdmin } from "@/utils/checkUser";
import { calculateCommissionPriceQuantitySettlementAndStatus } from "@/utils/getBookingPrice";
import { checkBookingAndUpdateStatus } from "@/lib/api/updateBookingStatus";

export const GET = async (req: NextRequest) => {

    try {


        const bookingID = getSearchParams(req, 'bookingID')
        const departmentID = getSearchParams(req, 'departmentID')
        const clientID = getSearchParams(req, 'clientID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //only admin and super-admin are allowed to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        await checkBookingAndUpdateStatus()

        if (clientID) {
            //get all client bookings
            const client = await prisma.client.findUnique({
                where: { id: clientID }, select: {
                    bookings: {
                        include: {
                            supplier: {
                                select: {
                                    name: true
                                }
                            },
                            schedule: {
                                select: {
                                    date: true,
                                    time: true,
                                }
                            }, client: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            if (!client) return notFoundRes('Client')

            //return the client bookings with a 200 response
            return okayRes(client.bookings)
        }

        if (bookingID) {

            //get single booking
            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                include: {
                    supplier: {
                        select: {
                            name: true
                        }
                    }, schedule: {
                        select: {
                            date: true,
                            time: true
                        }
                    }, client: {
                        select: {
                            username: true,
                            name: true
                        }
                    },
                    course: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            if (!booking) return notFoundRes('Schedule')

            //return the single booking with a 200 response
            return okayRes(booking)
        }

        if (departmentID) {

            //get all bookings in department
            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    bookings: {
                        orderBy: { created_at: 'desc' },
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            client_quantity: true,
                            supplier_quantity: true,
                            note: true,
                            card_name: true,
                            price: true,
                            created_at: true,
                            operator: true,
                            supplier: {
                                select: {
                                    name: true
                                }
                            },
                            schedule: {
                                select: {
                                    date: true,
                                    time: true
                                }
                            },
                            client: {
                                select: {
                                    username: true
                                }
                            },
                            course: {
                                select: {
                                    name: true
                                }
                            },
                            supplier_comment: true,
                            client_comment: true
                        }
                    }
                }
            })
            if (!department) return notFoundRes('Department')

            const modifyBooking = department.bookings.map(booking => ({
                ...booking,
                supplier_comment: booking.supplier_comment.length > 0 ? true : false,
                client_comment: booking.client_comment.length > 0 ? true : false

            }))

            //return all bookings in department with a 200 response
            return okayRes(modifyBooking)
        }

        //get all bookings
        const bookings = await prisma.booking.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                status: true,
                client_quantity: true,
                supplier_quantity: true,
                note: true,
                card_name: true,
                price: true,
                created_at: true,
                operator: true,
                supplier: {
                    select: {
                        name: true
                    }
                },
                schedule: {
                    select: {
                        date: true,
                        time: true
                    }
                },
                client: {
                    select: {
                        username: true
                    }
                },
                course: {
                    select: {
                        name: true
                    }
                },
                supplier_comment: true,
                client_comment: true
            }
        })
        if (!bookings) return badRequestRes()

        const modifyBooking = bookings.map(booking => ({
            ...booking,
            supplier_comment: booking.supplier_comment.length > 0 ? true : false,
            client_comment: booking.client_comment.length > 0 ? true : false

        }))

        //return all bookings with a 200 response
        return okayRes(modifyBooking)

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
        if (!session) return unauthorizedRes()

        const { scheduleID,
            supplierID,
            clientID,
            note,
            meetingInfoID,
            clientCardID,
            status,
            name,
            courseID,
            client_quantity,
            supplier_quantity,
            settlement,
        } = await req.json();

        //get all this data at once
        const [client, supplier, meetingInfo, card, schedule] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
            prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        ]);

        //get the operator of this booking
        const operator = session.user.type === SUPERADMIN ? ADMIN : session.user.type

        //check each of them if it exist
        if (!client) return notFoundRes('Client')
        if (!supplier) return notFoundRes('Supplier')
        if (!meetingInfo) return notFoundRes('Meeting Info')
        if (!card) return notFoundRes('Card')
        if (!schedule) return notFoundRes("Schedule")

        //get the current Date and compare the schedule date
        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        const scheduleDate = new Date(`${schedule.date}T${schedule.time}`);

        //check if client card is expired or schedule is passed
        if (currentDate > cardValidityDate || currentDate > scheduleDate) {
            return NextResponse.json(
                {
                    msg: currentDate > cardValidityDate ? 'Card is expired' : 'This schedule already passed',
                },
                { status: 400 }
            );
        }

        if (schedule.status === RESERVED) return existRes('Schedule already reserved')

        //get the date with this format 2023-11-22 (YEAR-MONTH-DAY)

        const today = new Date().toISOString().split('T')[0];

        if (schedule.date === today) {
            // Check if the booking time is at least 3 hours ahead
            const bookingTime = new Date(`${schedule.date}T${schedule.time}`);
            const minimumBookingTime = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);

            if (bookingTime < minimumBookingTime) {
                return NextResponse.json(
                    {
                        msg: 'Booking schedule must be at least 3 hours ahead of the current time.',
                    },
                    { status: 400 }
                );
            }
        }

        //retrieve department and supplierprice
        const [department, supplierPrice] = await Promise.all([
            prisma.department.findUnique({ where: { id: card?.card.departmentID } }),
            prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID } })
        ])
        if (!department) return notFoundRes(DEPARTMENT);
        //if supplierprice not found then it means it's not supported in card used
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' }, { status: 400 });

        //check if card have enough balance to book
        if (card.balance < Number(supplierPrice.price)) {
            return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 });
        }

        //get this data in this function I made to return the value base on department
        const { bookingPrice, supplierCommission, bookingQuantity, settlementDate, getStatus } = calculateCommissionPriceQuantitySettlementAndStatus({
            balance: supplier.balance,
            supplierPrice,
            supplierQuantity: Number(supplier_quantity),
            department,
            card: card.card,
            clientQuantity: Number(client_quantity),
            settlement,
            status
        })
        if (!settlementDate) return notFoundRes("Settlement Date")

        if (bookingQuantity.client <= 0 || bookingQuantity.supplier <= 0) return badRequestRes("Quantity must be positive number")

        //create booking
        const createBooking = await prisma.booking.create({
            data: {
                name,
                note,
                status: getStatus,
                operator,
                card_balance_cost: Number(supplierPrice.price),
                supplier_rate: supplierCommission,
                price: bookingPrice.toFixed(2),
                card_name: card.name,
                client_quantity: bookingQuantity.client,
                supplier_quantity: bookingQuantity.supplier,
                settlement: settlementDate,
                meeting_info: meetingInfo,
                clientCardID,
                supplier: { connect: { id: supplierID } },
                client: { connect: { id: clientID } },
                schedule: { connect: { id: schedule.id } },
                department: { connect: { id: department.id } },
                course: { connect: { id: courseID } },
            },
        });
        //if booking fails to create return 400 response
        if (!createBooking) return badRequestRes()

        //reduce client card balance if it's not in fingerpower department
        if (department.name.toLocaleLowerCase() !== FINGERPOWER) {

            //client balance will be reduce by the amount of supplierprice.price
            const reduceCardBalance = await prisma.clientCard.update({
                where: { id: card.id },
                data: { balance: card.balance - Number(supplierPrice.price) },
            });
            if (!reduceCardBalance) return badRequestRes();

            //get the supplier balance
            const balance = supplier.balance[0]

            const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
            const currentYear = currentDate.getUTCFullYear();

            // Construct the start and end dates in ISO format
            const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
            const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

            const [updateSupplierBalance, earnings] = await Promise.all([
                prisma.supplierBalance.update({
                    //apply the booking rate to supplier balance
                    where: { id: balance.id },
                    data: {
                        amount: Number(balance.amount) + supplierCommission
                    }
                }),
                prisma.supplierEarnings.findFirst({
                    //retrieve earnings for this month
                    where:
                    {
                        supplierBalanceID: balance.id,
                        rate: supplierCommission,
                        created_at: {
                            gte: startDate.toISOString(),
                            lt: endDate.toISOString(),
                        },
                    }
                })
            ])
            if (!updateSupplierBalance) return badRequestRes("Faild to get supplier balance")

            //if earnings this month exist update the earnings instead of creating a new data
            if (earnings) {
                const updateSupplierEarnings = await prisma.supplierEarnings.update({
                    where: { id: earnings.id },
                    data: {
                        amount: Number(earnings.amount) + balance.booking_rate,
                        quantity: earnings.quantity + 1
                    }
                })
                if (!updateSupplierEarnings) return badRequestRes()
            } else {
                //if there's no earnings for this month then create one
                const createEarnings = await prisma.supplierEarnings.create({
                    data: {
                        name: 'Class Fee',
                        balance: { connect: { id: balance.id } },
                        amount: balance.booking_rate,
                        quantity: 1,
                        rate: balance.booking_rate,
                    }
                })
                if (!createEarnings) return badRequestRes()
            }

        }

        //update schedule to reserved
        const updateSchedule = await prisma.supplierSchedule.update({
            where: { id: schedule.id },
            data: {
                status: RESERVED,
                clientID: client.id,
                clientUsername: client.username,
            },
        })
        if (!updateSchedule) return badRequestRes();

        //send emails to client and supplier
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/created`, {
            bookingID: createBooking.id, operator
        })

        //return 201 response and pass bookingID we use this in front-end to send emails synchronously
        return createdRes();

    } catch (error) {
        console.error(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
};


export const PATCH = async (req: NextRequest) => {

    //retrieve data we need
    const bookingID = getSearchParams(req, 'bookingID')
    const { scheduleID, supplierID, clientID, note, operator, meetingInfoID, clientCardID, status, name, courseID, client_quantity, supplier_quantity, settlement } = await req.json()

    try {

        //only admin and super-admin are allowed to proceed
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //check bookingID
        if (!bookingID) return notFoundRes("Booking")

        //retrieve this data all at once
        const [client, supplier, meetingInfo, card, booking, schedule] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
            prisma.booking.findUnique({ where: { id: bookingID }, include: { supplier: { include: { balance: true } } } }),
            prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        ]);

        //check each of the data if it exist else return 404 response
        if (!booking) return notFoundRes("Booking")
        if (!client) return notFoundRes('Client')
        if (!card) return notFoundRes('Client card')
        if (!supplier) return notFoundRes('Supplier')
        if (!meetingInfo) return notFoundRes('Meeting info')
        if (!schedule) return notFoundRes("Schedule")

        //retrieve previous card in booking
        const prevCard = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
        if (!prevCard) return notFoundRes('Previous Client Card')

        //retrieve supplier price
        const prevSupplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking.supplierID, cardID: prevCard.cardID } })
        if (!prevSupplierPrice) return notFoundRes('Previous Supported Supplier')

        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        const scheduleDate = new Date(`${schedule.date}T${schedule.time}`);

        //check if client card is changed and expired or schedule is passed
        if (card.id !== booking.clientCardID && currentDate > cardValidityDate) return badRequestRes("Card is expired")
        if (schedule.id !== booking.scheduleID && currentDate > scheduleDate) return badRequestRes("Schedule is passed")

        //retrieve department and supplierPrice
        const [department, supplierPrice] = await Promise.all([
            prisma.department.findUnique({ where: { id: card.card.departmentID } }),
            prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card.cardID } })
        ])
        if (!supplierPrice) return badRequestRes("Supplier is not supported in this card")
        if (!department) return notFoundRes("Department")

        //check if balance is enough to book
        if (card.balance < Number(supplierPrice.price)) badRequestRes("Card doesn't have enough balance to book")

        //get this data in this function I made to return the value base on department
        const { bookingPrice, supplierCommission, bookingQuantity, settlementDate, getStatus } = calculateCommissionPriceQuantitySettlementAndStatus({
            balance: supplier.balance,
            supplierPrice,
            supplierQuantity: supplier_quantity,
            department,
            card: card.card,
            clientQuantity: client_quantity,
            settlement,
            status
        })
        if (!settlementDate) return notFoundRes("Settlement Date")

        //update the booking
        const updateBooking = await prisma.booking.update({
            where: { id: bookingID },
            data: {
                note,
                status: getStatus,
                operator,
                name,
                price: bookingPrice.toFixed(2),
                courseID,
                card_name: card.name,
                card_balance_cost: Number(supplierPrice.price),
                client_quantity: bookingQuantity.client,
                supplier_quantity: bookingQuantity.supplier,
                supplier_rate: supplierCommission,
                settlement: settlementDate,
                meeting_info: meetingInfo,
                departmentID: department.id,
                supplierID,
                clientID,
                clientCardID,
                scheduleID
            }, include: { supplier: { include: { balance: true } } }
        })
        if (!updateBooking) return badRequestRes()

        //check if schedule changed
        if (booking.scheduleID !== scheduleID) {

            //check if the schedule is reserved
            if (schedule.status === RESERVED) return NextResponse.json({ msg: 'Schedule already reserved' }, { status: 409 })

            //update the previous schedule as well as the new schedule
            const [updatePreviousSchedule, updateNewSchedule] = await Promise.all([
                prisma.supplierSchedule.update({
                    where: { id: booking.scheduleID }, data: {
                        //we set this to null so schedule will be marked as avilable again
                        clientID: null,
                        clientUsername: null,
                        status: AVAILABLE
                    }
                }),
                prisma.supplierSchedule.update({
                    where: { id: schedule.id }, data: {
                        clientID: client.id,
                        clientUsername: client.username,
                        status: RESERVED
                    }
                })

            ])
            if (!updatePreviousSchedule || !updateNewSchedule) return badRequestRes()
        }

        //if this booking comes from verbalace department then deduct the client card balance
        if (department.name.toLocaleLowerCase() === VERBALACE) {
            // reduce client card balance
            const payClient = await prisma.clientCard.update({
                where: { id: updateBooking.clientCardID },
                data: { balance: card.balance - Number(supplierPrice.price) }
            })
            if (!payClient) return badRequestRes()

            //refund the previous client
            const refundClient = await prisma.clientCard.update({
                where: { id: booking.clientCardID },
                data: { balance: prevCard.balance + Number(prevSupplierPrice.price) }
            })
            if (!refundClient) return badRequestRes()

        }

        if (booking.supplierID !== updateBooking.supplierID) {

            //if the supplier is changed in the booking deduct the previous commission and add it to the new supplier
            //after that we'll create a earnings for new supplier and deductions for previous supplier in booking

            //this is the previous supplier balance and booking rate
            const prevSupplierBalance = booking.supplier.balance[0]

            // this is the newsupplier balance and booking rate
            const newSupplierBalance = updateBooking.supplier.balance[0]

            //current month and date we use this to find earnings and deductions to supplier in this month

            const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
            const currentYear = currentDate.getUTCFullYear();

            // Construct the start and end dates in ISO format
            const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
            const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

            const [updatePrevSupplierBalance, updateNewSupplierInBookingBalance, retrieveNewSupplierEarningsThisMonth, retrivePrevSupplierDeductionsThisMonth] = await Promise.all([
                // update the previous supplier balance deduct the previous booking rate
                prisma.supplierBalance.update({
                    where: { id: booking.supplier.id }, data: { amount: Number(prevSupplierBalance.amount) - Number(booking.supplier_rate) }
                }),

                //update the new supplierbalance add the bookingrate to the supplier
                prisma.supplierBalance.update({
                    where: { id: updateBooking.supplierID }, data: { amount: Number(newSupplierBalance.amount) + Number(updateBooking.supplier_rate) }
                }),
                //retrieve the newsupplier earnings for this month if it exist then we just need to update this earnings
                prisma.supplierEarnings.findFirst({
                    where: {
                        supplierBalanceID: newSupplierBalance.id,
                        rate: Number(booking.supplier_rate),
                        //this will get the earnings for this month
                        created_at: {
                            gte: startDate.toISOString(),
                            lt: endDate.toISOString(),
                        },

                    }
                }),
                //retrieve the previous supplier deductions for this month if it exist then we just need to update this deductions
                prisma.supplierDeductions.findFirst({
                    where: {
                        supplierBalanceID: prevSupplierBalance.id,
                        rate: Number(updateBooking.supplier_rate),
                        //this will find the deduction this month
                        created_at: {
                            gte: startDate.toISOString(),
                            lt: endDate.toISOString(),
                        },
                    }
                })
            ])
            if (!updatePrevSupplierBalance || !updateNewSupplierInBookingBalance) return badRequestRes()

            //if newsupplier earnings this month exist update the amount and quantity
            if (retrieveNewSupplierEarningsThisMonth) {

                const updateNewSupplierEarnings = await prisma.supplierEarnings.update({
                    where: { id: retrieveNewSupplierEarningsThisMonth.id }, data: {
                        // we add the earnings amount to the supplier booking rate
                        amount: Number(retrieveNewSupplierEarningsThisMonth.amount) + Number(updateBooking.supplier_rate),
                        //add 1 quantity
                        quantity: retrieveNewSupplierEarningsThisMonth.quantity + 1
                    }
                })
                if (!updateNewSupplierEarnings) return badRequestRes()
                //return 400 response if it fails
            } else {
                //else create a new data
                const createNewSupplierEarnings = await prisma.supplierEarnings.create({
                    data: {
                        balance: { connect: { id: newSupplierBalance.id } },
                        name: 'Class Fee',
                        amount: Number(updateBooking.supplier_rate),
                        quantity: 1,
                        rate: Number(updateBooking.supplier_rate)
                    }
                })
                if (!createNewSupplierEarnings) return badRequestRes()
                //return 400 response if it fails
            }

            //if previous supplier deductions this month exist update the amount and quantity
            if (retrivePrevSupplierDeductionsThisMonth) {

                const updatePreviousSupplierDeductions = await prisma.supplierDeductions.update({
                    where: { id: retrivePrevSupplierDeductionsThisMonth.id }, data: {
                        //add 1 quantity
                        quantity: retrivePrevSupplierDeductionsThisMonth.quantity + 1,
                        //deduct the previous supplier rate this rate is based on the supplier rate when this booking is created
                        amount: Number(retrivePrevSupplierDeductionsThisMonth.amount) + Number(booking.supplier_rate)
                    }
                })
                if (!updatePreviousSupplierDeductions) return badRequestRes()
                //return 400 response if it fails

            } else {
                //else create a new data
                const createPreviousSupplierDeductions = await prisma.supplierDeductions.create({
                    data: {
                        name: 'Class Cancellation',
                        balance: { connect: { id: prevSupplierBalance.id } },
                        quantity: 1,
                        rate: Number(booking.supplier_rate),
                        amount: Number(booking.supplier_rate)
                    }
                })
                if (!createPreviousSupplierDeductions) return badRequestRes()
                //return 400 response if it fails
            }

        }

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
        const { searchParams } = new URL(req.url)
        const bookingID = searchParams.get('bookingID')
        const bookingIDS = searchParams.getAll('bookingID')
        const type = searchParams.get('type')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (bookingIDS.length < 1) return notFoundRes('Booking')
        if (!type) return notFoundRes('Type')

        if (type === 'delete') {

            //only allow admin to proceed
            const isAdmin = checkIsAdmin(session.user.type)
            if (!isAdmin) return unauthorizedRes()

            // Fetch the booking IDs
            const findBookingIds = await prisma.booking.findMany({
                where: {
                    id: {
                        in: bookingIDS.map(id => id)
                    }
                },
                select: { id: true },
            });
            if (!findBookingIds) return badRequestRes("Failed to get all bookingIDS")

            // Extract the IDs from the result
            const validBookingIds = findBookingIds.map((booking) => booking.id);

            // Update schedules related to the bookings
            const updateSchedule = await prisma.supplierSchedule.updateMany({
                where: {
                    booking: {
                        some: {
                            id: { in: validBookingIds },
                        },
                    },
                },
                data: {
                    status: AVAILABLE,
                    clientUsername: null,
                    clientID: null
                },
            });
            if (!updateSchedule) return badRequestRes()

            //delete this valid bookings
            const deleteBookings = await prisma.booking.deleteMany({
                where: { id: { in: validBookingIds } }
            })
            if (!deleteBookings) return badRequestRes()

            return okayRes()
        }

        if (type === 'cancel' && bookingID) {

            //only super-admin,admin and client can proceed to this code
            if (![SUPERADMIN, ADMIN, CLIENT].includes(session.user.type)) return unauthorizedRes()

            //retrieve booking
            const booking = await prisma.booking.findUnique({
                where: { id: bookingID },
                include: {
                    schedule: true, supplier: {
                        select: { balance: true }
                    }
                }
            })
            if (!booking) return notFoundRes('Booking')

            //check if booking already canceled
            if (booking.status === CANCELED) return badRequestRes("Booking already canceled")

            //retrieve client card
            const card = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!card) return notFoundRes('Client Card')

            if (session.user.type === CLIENT) {
                const currentDate = new Date();
                const today = new Date().toISOString().split('T')[0];
                const schedule = booking.schedule;

                if (schedule.date === today) {
                    // Check if the booking time is at least 3 hours ahead
                    const bookingTime = new Date(`${schedule.date}T${schedule.time}`);
                    const minimumBookingTime = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000);

                    if (bookingTime < minimumBookingTime) {
                        //if booking is not 3 hours ahead of schedule then we don't allow client to cancel this booking in their own
                        //they need to cancel the booking by requesting it to admin
                        return NextResponse.json(
                            { msg: 'Booking schedule must be at least 3 hours ahead of the current time.' },
                            { status: 400 }
                        )
                    }

                }

                const supplierBalance = booking.supplier.balance[0]

                const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
                const currentYear = currentDate.getUTCFullYear();

                // Construct the start and end dates in ISO format
                const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
                const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

                //create deduction to supplier and update the balance
                const [retrieveSupplierDeductionsThisMonth, deductSupplierBalance] = await Promise.all([
                    prisma.supplierDeductions.findFirst({
                        where: {
                            supplierBalanceID: supplierBalance.id,
                            rate: Number(booking.supplier_rate),
                            created_at: {
                                gte: startDate.toISOString(),
                                lt: endDate.toISOString(),
                            },
                        }
                    }),
                    prisma.supplierBalance.update({
                        where: { id: supplierBalance.id },
                        data: { amount: Number(supplierBalance.amount) - Number(booking.supplier_rate) }
                    })
                ])
                if (!deductSupplierBalance) return badRequestRes()

                //if previous supplier deductions this month exist update the amount and quantity
                if (retrieveSupplierDeductionsThisMonth) {

                    const updatePreviousSupplierDeductions = await prisma.supplierDeductions.update({
                        where: { id: retrieveSupplierDeductionsThisMonth.id }, data: {
                            //add 1 quantity
                            quantity: retrieveSupplierDeductionsThisMonth.quantity + 1,
                            //deduct the previous supplier rate this rate is based on the supplier rate when this booking is created
                            amount: Number(retrieveSupplierDeductionsThisMonth.amount) + Number(booking.supplier_rate)
                        }
                    })
                    if (!updatePreviousSupplierDeductions) return badRequestRes()
                    //return 400 response if it fails

                } else {
                    //else create a new data
                    const createPreviousSupplierDeductions = await prisma.supplierDeductions.create({
                        data: {
                            name: 'Class Cancellation',
                            balance: { connect: { id: supplierBalance.id } },
                            quantity: 1,
                            rate: Number(booking.supplier_rate),
                            amount: Number(booking.supplier_rate)
                        }
                    })
                    if (!createPreviousSupplierDeductions) return badRequestRes()
                    //return 400 response if it fails
                }
            }

            //refund the client,update booking status to canceled and schedule

            const [refundClient, cancelBooking, updateSchedule] = await Promise.all([
                prisma.clientCard.update({
                    where: { id: card.id },
                    data: { balance: card.balance + booking.card_balance_cost }
                }),
                prisma.booking.update({
                    where: {
                        id: booking.id
                    }, data: { status: CANCELED }
                }),
                prisma.supplierSchedule.update({
                    where: {
                        id: booking.scheduleID
                    },
                    data: { status: AVAILABLE, }
                }),
            ])
            if (!refundClient || !cancelBooking || !updateSchedule) return badRequestRes()

            const operator = session.user.type === SUPERADMIN ? ADMIN : session.user.type

            // to send emails to supplier and clients that the booking is canceled
            axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/cancel`, { bookingID: booking.id, operator })

            //return 200 response
            return okayRes()
        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


