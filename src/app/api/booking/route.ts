import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { getAuth } from "@/lib/nextAuth";

export const GET = async (req: NextRequest) => {

    const bookingID = getSearchParams(req, 'bookingID')
    const departmentID = getSearchParams(req, 'departmentID')
    const clientID = getSearchParams(req, 'clientID')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        if (clientID) {
            const client = await prisma.client.findUnique({
                where: { id: clientID }, select: {
                    bookings: {
                        include: {
                            supplier: {
                                select: {
                                    name: true
                                }
                            }, schedule: {
                                select: {
                                    date: true,
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

            return okayRes(booking)
        }

        if (departmentID) {

            //get all bookings in department
            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    bookings: {
                        orderBy: { created_at: 'desc' },
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
                                    username: true
                                }
                            },
                            course: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            if (!department) return notFoundRes('Department')

            return okayRes(department.bookings)
        }

        //get all bookings
        const bookings = await prisma.booking.findMany({
            orderBy: { created_at: 'desc' },
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
                        username: true
                    }
                },
                course: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!bookings) return badRequestRes()

        return okayRes(bookings)

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

        const { scheduleID, supplierID, clientID, note, operator, meetingInfoID, clientCardID, status, name, courseID, quantity, settlement } = await req.json();

        const checkNotFound = (entity: string, value: any) => {
            if (!value) return notFoundRes(entity)
        }

        const params = [scheduleID, name, supplierID, clientID, clientCardID, settlement, operator, meetingInfoID, status, quantity];

        params.forEach((param, index) =>
            checkNotFound(['Schedule', 'Booking name', 'Supplier', 'Client', 'Card', 'Settlement period', 'Operator', 'Meeting info', 'Status', 'quantity'][index], param)
        )

        const [client, supplier, meetingInfo, card, schedule] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
            prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        ]);

        if (!client) return notFoundRes('Client')
        if (!supplier) return notFoundRes('Supplier')
        if (!meetingInfo) return notFoundRes('Meeting Info')
        if (!card) return notFoundRes('Card')
        if (!schedule) return notFoundRes("Schedule")

        const currentDate = new Date();
        const cardValidityDate = new Date(card?.validity!);
        const scheduleDate = new Date(`${schedule.date}T${schedule.time}`);

        if (currentDate > cardValidityDate || currentDate > scheduleDate) {
            return NextResponse.json(
                {
                    msg: currentDate > cardValidityDate ? 'Card is expired' : 'This schedule already passed',
                },
                { status: 400 }
            );
        }
        if (schedule.status === 'reserved') return existRes('Schedule already reserved')

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

        const department = await prisma.department.findUnique({ where: { id: card?.card.departmentID } });
        if (!department) return notFoundRes('Department');

        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID } });
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' }, { status: 400 });

        if (card.balance < supplierPrice.price) {
            return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 });
        }

        const bookingPrice = department.name.toLocaleLowerCase() === 'fingerpower' ? quantity * Number(card.card.price) : (Number(card.card.price) / card.card.balance) * supplierPrice.price

        const createBooking = await prisma.booking.create({
            data: {
                note,
                status,
                operator,
                card_balance_cost: supplierPrice.price,
                supplier_rate: supplier.balance[0].booking_rate,
                name,
                price: bookingPrice.toFixed(2),
                card_name: card?.name!,
                quantity: Number(quantity),
                settlement,
                supplier: { connect: { id: supplierID } },
                client: { connect: { id: clientID } },
                schedule: { connect: { id: schedule.id } },
                meeting_info: meetingInfo!,
                clientCardID,
                department: { connect: { id: department.id } },
                course: { connect: { id: courseID } },
            },
        });
        if (!createBooking) return badRequestRes()

        //reduce client card balance if it's not in fingerpower department
        if (department.name.toLocaleLowerCase() !== 'fingerpower') {
            const reduceCardBalance = await prisma.clientCard.update({
                where: { id: card?.id! },
                data: { balance: card?.balance! - supplierPrice.price },
            });
            if (!reduceCardBalance) return badRequestRes();
        }

        //update supplier schedule and create earnings for supplier as well as updating the supplier balance

        const [updateSchedule, supplierEarnings, updateSupplierBalance] = await Promise.all([
            prisma.supplierSchedule.update({
                where: { id: schedule.id },
                data: {
                    status: 'reserved',
                    clientID: client?.id,
                    clientUsername: client?.username,
                },
            }),
            prisma.supplierEarnings.create({
                data: {
                    name: 'Class Fee',
                    quantity: Number(quantity),
                    rate: supplier?.balance[0].booking_rate!,
                    amount: supplier?.balance[0].booking_rate!,
                    balance: { connect: { id: supplier?.balance[0].id } }
                }
            }),
            prisma.supplierBalance.update({
                where: { id: supplier?.balance[0].id }, data: {
                    amount: supplier?.balance[0].amount! + supplier?.balance[0].booking_rate!
                }
            })
        ])
        if (!updateSchedule || !supplierEarnings || !updateSupplierBalance) return badRequestRes();

        return createdRes(createBooking.id);

    } catch (error) {
        console.error(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
};


export const PATCH = async (req: NextRequest) => {

    const bookingID = getSearchParams(req, 'bookingID')
    const { scheduleID, supplierID, clientID, note, operator, meetingInfoID, clientCardID, status, name, courseID, quantity, settlement } = await req.json()

    const checkNotFound = (entity: string, value: any) => {
        if (!value) return notFoundRes(entity);
    };

    const params = [scheduleID, name, supplierID, clientID, clientCardID, settlement, operator, meetingInfoID, status, quantity];

    const paramNames = ['Schedule', 'Booking name', 'Supplier', 'Client', 'Card', 'Settlement period', 'Operator', 'Meeting info', 'Status', 'quantity'];

    params.forEach((param, index) =>
        checkNotFound(paramNames[index], param)
    );

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        if (!bookingID) return notFoundRes("Booking")

        //check booking
        const [client, supplier, meetingInfo, card, booking, schedule] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
            prisma.booking.findUnique({ where: { id: bookingID }, include: { supplier: { include: { balance: true } } } }),
            prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        ]);

        if (!booking) return notFoundRes("Booking")
        if (!client) return notFoundRes('Client')
        if (!card) return notFoundRes('Client card')
        if (!supplier) return notFoundRes('Supplier')
        if (!meetingInfo) return notFoundRes('Meeting info')
        if (!schedule) return notFoundRes("Schedule")

        const prevCard = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
        if (!prevCard) return notFoundRes('Client Card')

        const prevSupplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking.supplierID, cardID: prevCard.cardID } })
        if (!prevSupplierPrice) return notFoundRes('Supplier Price')

        //check if card expired
        const currentDate = new Date();
        const cardValidityDate = new Date(card?.validity!);
        if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'card expired' }, { status: 400 })

        const [department, supplierPrice] = await Promise.all([
            prisma.department.findUnique({ where: { id: card.card.departmentID } }),
            prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card.cardID } })
        ])
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported' }, { status: 400 })
        if (!department) return notFoundRes("Department")

        //check if balance is enough to book
        if (card.balance < supplierPrice.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

        const bookingPrice = department.name.toLocaleLowerCase() === 'fingerpower' ? quantity * Number(card.card.price) : (Number(card.card.price) / card.card.balance) * supplierPrice.price
        const updateBooking = await prisma.booking.update({
            where: { id: bookingID },
            data: {
                note,
                status,
                operator,
                name,
                price: bookingPrice.toFixed(2),
                courseID,
                card_name: card.name,
                card_balance_cost: supplierPrice.price,
                quantity: Number(quantity),
                settlement,
                supplier_rate: supplier.balance[0].booking_rate,
                supplierID,
                clientID,
                clientCardID,
                meeting_info: meetingInfo,
                scheduleID,
                departmentID: department.id
            }, include: { supplier: { include: { balance: true } } }
        })
        if (!updateBooking) return badRequestRes()

        if (department.name.toLocaleLowerCase() === 'verbalace') {
            // reduce client card balance
            const payClient = await prisma.clientCard.update({
                where: { id: updateBooking.clientCardID },
                data: { balance: card.balance - supplierPrice.price }
            })
            if (!payClient) return badRequestRes()

            //refund the previous client
            const refundClient = await prisma.clientCard.update({
                where: { id: booking.clientCardID },
                data: { balance: prevCard.balance + prevSupplierPrice.price }
            })
            if (!refundClient) return badRequestRes()

        }

        if (booking.supplier.id !== updateBooking.supplier.id) {

            //if the supplier is changed deduct the previous commission and add it to the new supplier
            //after that we'll create a earnings for new supplier and deductions for previous supplier in booking

            const prevSupplierBalance = booking.supplier.balance[0].amount
            const prevSupplierRate = booking.supplier.balance[0].booking_rate

            const newSupplierBalance = updateBooking.supplier.balance[0].amount
            const newSupplierRate = updateBooking.supplier.balance[0].booking_rate

            const [updatePrevSupplierBalance, updateNewSupplierInBookingBalance, createNewSupplierEarnings, createPrevSupplierDeductions] = await Promise.all([
                prisma.supplierBalance.update({
                    where: { id: booking.supplier.id }, data: { amount: prevSupplierBalance - prevSupplierRate }
                }),
                prisma.supplierBalance.update({
                    where: { id: updateBooking.supplierID }, data: { amount: newSupplierBalance + newSupplierRate }
                }),
                prisma.supplierEarnings.create({
                    data: {
                        name: 'Class',
                        amount: newSupplierRate,
                        balance: { connect: { id: updateBooking.supplier.balance[0].id } },
                        rate: updateBooking.supplier.balance[0].booking_rate,
                        quantity: 1
                    }
                }),
                prisma.supplierDeductions.create({
                    data: {
                        name: 'Cancellation',
                        quantity: 1,
                        amount: prevSupplierRate,
                        rate: prevSupplierRate,
                        balance: { connect: { id: booking.supplier.balance[0].id } }
                    }
                })
            ])
            if (!updatePrevSupplierBalance || updateNewSupplierInBookingBalance || createNewSupplierEarnings || createPrevSupplierDeductions) return badRequestRes()
        }

        if (booking.scheduleID !== scheduleID) {
            if (schedule.status === 'reserved') return NextResponse.json({ msg: 'Schedule already reserved' }, { status: 409 })

            const updatePreviousSchedule = await prisma.supplierSchedule.update({
                where: { id: booking.scheduleID }, data: {
                    clientID: null,
                    clientUsername: null,
                    status: 'available'
                }
            })
            if (!updatePreviousSchedule) return badRequestRes()

            const updateNewSchedule = await prisma.supplierSchedule.update({
                where: { id: schedule.id }, data: {
                    clientID: client.id,
                    clientUsername: client.username,
                    status: 'reserved'
                }
            })
            if (!updateNewSchedule) return badRequestRes()
        }

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const bookingID = searchParams.get('bookingID')
    const bookingIDS = searchParams.getAll('bookingID')
    const type = searchParams.get('type')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (bookingIDS.length < 1) return notFoundRes('bookingID')
        if (!type) return notFoundRes('Type')

        if (type === 'delete') {

            if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

            // Fetch the booking IDs
            const bookingIDs = await prisma.booking.findMany({
                where: { /* your conditions here */ },
                select: { id: true },
            });

            // Extract the IDs from the result
            const bookingIDS = bookingIDs.map((booking) => booking.id);

            // Update schedules related to the bookings
            const updateSchedule = await prisma.supplierSchedule.updateMany({
                where: {
                    booking: {
                        some: {
                            id: { in: bookingIDS },
                        },
                    },
                },
                data: {
                    status: 'available',
                    clientUsername: null,
                    clientID: null
                },
            });
            if (!updateSchedule) return badRequestRes()

            const deleteBookings = await prisma.booking.deleteMany({
                where: { id: { in: bookingIDS } }
            })
            if (!deleteBookings) return badRequestRes()

            return okayRes()
        }

        if (type === 'cancel' && bookingID) {

            //only super-admin,admin and client can proceed to this code
            if (!['super-admin', 'admin', 'client'].includes(session.user.type)) return unauthorizedRes()

            //retrieve booking
            const booking = await prisma.booking.findUnique({ where: { id: bookingID }, include: { schedule: true, supplier: { select: { balance: true } } } })
            if (!booking) return notFoundRes('Booking')

            //retrieve client card
            const card = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!card) return notFoundRes('Client Card')

            if (session.user.type === 'client') {
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

                //create deduction to supplier and update the balance
                const [createDeductionToSupplier, deductSupplierBalance] = await Promise.all([
                    prisma.supplierDeductions.create({
                        data: {
                            amount: booking.supplier_rate * Number(booking.quantity),
                            rate: booking.supplier_rate, quantity: 1,
                            name: 'Class Cancellation',
                            balance: { connect: { id: booking.supplier.balance[0].id } }
                        }
                    }),
                    prisma.supplierBalance.update({
                        where: { id: booking.supplier.balance[0].id },
                        data: { amount: booking.supplier.balance[0].amount - booking.supplier_rate }
                    })
                ])
                if (!createDeductionToSupplier || !deductSupplierBalance) return badRequestRes()
            }

            //refund the client,update booking status to canceled and schedule

            const [refundClient, cancelBooking, updateSchedule] = await Promise.all([
                prisma.clientCard.update({
                    where: { id: card.id },
                    data: { balance: card.balance + booking.card_balance_cost }
                }),
                prisma.booking.update({
                    where: {
                        id: bookingID
                    }, data: { status: 'canceled' }
                }),
                prisma.supplierSchedule.update({
                    where: {
                        id: booking.scheduleID
                    },
                    data: { status: 'canceled', }
                }),
            ])
            if (!refundClient || !cancelBooking || !updateSchedule) return badRequestRes()

            //send back the bookingID in front-end we'll use this id
            // to send emails to supplier and clients that the booking is canceled
            return okayRes(booking.id)
        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


