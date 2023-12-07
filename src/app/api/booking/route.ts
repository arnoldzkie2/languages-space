import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const bookingID = searchParams.get('bookingID')
    const departmentID = searchParams.get('departmentID')
    const clientID = searchParams.get('clientID')

    try {

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
            const departmentBookings = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    bookings: {
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
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            if (!departmentBookings) return notFoundRes('Department')

            return okayRes(departmentBookings.bookings)
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

export const POST = async (req: Request) => {
    try {
        const {
            scheduleID,
            supplierID,
            clientID,
            note,
            operator,
            meetingInfoID,
            clientCardID,
            status,
            name,
            courseID,
            quantity,
            settlement,
        } = await req.json();

        const checkNotFound = (entity: string, value: any) => {
            if (!value) return notFoundRes(entity);
        };

        [scheduleID, name, supplierID, clientID, clientCardID, settlement, operator, meetingInfoID].forEach((param, index) =>
            checkNotFound(['Schedule', 'Booking name', 'Supplier', 'Client', 'Card', 'Settlement period', 'Operator', 'Meeting info'][index], param)
        );

        // Check schedule
        const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } });
        if (!schedule || schedule.status === 'reserved') return notFoundRes('Schedule');

        // Check client, supplier, meetingInfo, card
        const [client, supplier, meetingInfo, card] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
        ]);

        [client, supplier, meetingInfo, card].forEach((entity, index) => checkNotFound(['Client', 'Supplier', 'Meeting info in supplier', 'Client Card'][index], entity));

        // Check card expiration and schedule date
        const currentDate = new Date();
        const cardValidityDate = new Date(card?.validity!);
        const scheduleDate = new Date(`${schedule.date}T${schedule.time}`);
        if (currentDate > cardValidityDate || currentDate > scheduleDate) {
            return NextResponse.json({ msg: currentDate > cardValidityDate ? 'Client card expired' : 'This schedule already passed' }, { status: 400 });
        }

        // Check department
        const department = await prisma.department.findUnique({ where: { id: card?.card.departmentID } });
        if (!department) return notFoundRes('Department');

        // Check supplier price
        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID } });

        // Check if supplier is supported
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' });

        // Check if balance is enough
        if (card?.balance! < supplierPrice.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 });

        // Calculate booking price
        const bookingPrice = department.name.toLocaleLowerCase() === 'fingerpower' ? quantity * card?.card.price! : (card?.card.price! / card?.card.balance!) * supplierPrice.price;

        // Create booking
        const createBooking = await prisma.booking.create({
            data: {
                note,
                status,
                operator,
                name,
                price: bookingPrice,
                card_name: card?.name!,
                quantity,
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
        if (!createBooking) return badRequestRes();

        // Update client card balance for verbalace
        if (department.name.toLocaleLowerCase() !== 'fingerpower') {
            const reduceCardBalance = await prisma.clientCard.update({
                where: { id: card?.id! },
                data: { balance: card?.balance! - supplierPrice.price },
            });
            if (!reduceCardBalance) return badRequestRes();
        }

        // Update schedule status
        const updateSchedule = await prisma.supplierSchedule.update({
            where: { id: schedule.id },
            data: {
                status: 'reserved',
                clientID: client?.id,
                clientUsername: client?.username,
            },
        });
        if (!updateSchedule) return badRequestRes();

        return createdRes();
        
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

    if (!scheduleID) return notFoundRes('scheduleID')
    if (!supplierID) return notFoundRes('supplierID')
    if (!clientID) return notFoundRes('clientID')
    if (!clientCardID) return notFoundRes('clientCardiD')
    if (!meetingInfoID) return notFoundRes('Meeting Info')

    try {

        if (bookingID) {

            //check booking
            const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!booking) return notFoundRes('Booking')

            const prevCard = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!prevCard) return notFoundRes('Client Card')

            const prevSupplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking.supplierID, cardID: prevCard.cardID } })
            if (!prevSupplierPrice) return notFoundRes('Supplier Price')

            //check schedule
            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
            if (!schedule) return notFoundRes('Schedule')

            //check client
            const client = await prisma.client.findUnique({ where: { id: clientID } })
            if (!client) return notFoundRes('Client')

            //check supplier
            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            const meetingInfo = await prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } })
            if (!meetingInfo) return notFoundRes('Meeting info in supplier')

            //check card
            const card = await prisma.clientCard.findUnique({
                where: { id: clientCardID }, include: {
                    card: true
                }
            })
            if (!card) return notFoundRes('Card')

            //check if card expired
            const currentDate = new Date();
            const cardValidityDate = new Date(card.validity);
            if (currentDate > cardValidityDate) return NextResponse.json({ msg: 'Client card expired' }, { status: 400 })

            const department = await prisma.department.findUnique({ where: { id: card.card.departmentID } })
            if (!department) return notFoundRes("Department")

            //check supplierprice
            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card.cardID } })
            if (!supplierPrice) return notFoundRes('Supplier is not supported in this card')

            //check if balance is enough to book
            if (card.balance < supplierPrice.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            if (department.name.toLocaleLowerCase() === 'fingerpower') {

                const bookingPrice = quantity * card.card.price

                const updateBooking = await prisma.booking.update({
                    where: {
                        id: bookingID
                    },
                    data: {
                        note, status, operator, name, price: bookingPrice, courseID, card_name: card.name, quantity, settlement,
                        supplierID, clientID, clientCardID, meeting_info: meetingInfo, scheduleID, departmentID: department.id
                    }
                })
                if (!updateBooking) return badRequestRes()

            } else {

                const bookingPrice = (card.card.price / card.card.balance) * supplierPrice.price

                //update the booking
                const updateBooking = await prisma.booking.update({
                    where: {
                        id: bookingID
                    },
                    data: {
                        note, status, operator, name, price: bookingPrice, courseID, card_name: card.name, quantity, settlement,
                        supplierID, clientID, clientCardID, meeting_info: meetingInfo, scheduleID, departmentID: department.id
                    }
                })
                if (!updateBooking) return badRequestRes()

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

        } else {

            return notFoundRes('bookingID')

        }


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

        if (bookingIDS.length < 1) return notFoundRes('bookingID')
        if (!type) return notFoundRes('Type')

        if (type === 'delete') {

            const deleteBookings = await prisma.booking.deleteMany({
                where: { id: { in: bookingIDS } }
            })
            if (!deleteBookings) return badRequestRes()

            return okayRes()

        }

        if (type === 'cancel' && bookingID) {

            const booking = await prisma.booking.findUnique({ where: { id: bookingID } })
            if (!booking) return notFoundRes('Booking')

            //retrieve client card
            const card = await prisma.clientCard.findUnique({ where: { id: booking.clientCardID } })
            if (!card) return notFoundRes('Client Card')

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID: booking.supplierID, cardID: card.cardID } })
            if (!supplierPrice) return badRequestRes()

            //refund the client
            const refundClient = await prisma.clientCard.update({
                where: { id: card.id },
                data: { balance: card.balance + supplierPrice.price }
            })
            if (!refundClient) return badRequestRes()

            // update the booking status to canceled
            const cancelBooking = await prisma.booking.update({
                where: {
                    id: bookingID
                }, data: { status: 'canceled' }
            })
            if (!cancelBooking) return badRequestRes()

            //update the schedule status to available
            const updateSchedule = await prisma.supplierSchedule.update({
                where: {
                    id: booking.scheduleID
                },
                data: { status: 'available', clientID: null, clientUsername: null }
            })
            if (!updateSchedule) return badRequestRes()

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


