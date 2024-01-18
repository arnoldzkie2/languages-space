import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { CANCELED, CONFIRMED, DEPARTMENT, SUPPLIER } from "@/utils/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        //authorize user
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow supplier to confirm a request booking
        if (session.user.type !== SUPPLIER) return unauthorizedRes()

        //get the requestBoookingID in request body
        const { bookingRequestID } = await req.json()

        //retrieve the bookingRequest
        const bookingRequest = await prisma.bookingRequest.findUnique({
            where: { id: bookingRequestID },
            include: {
                supplier: {
                    include: {
                        balance: true
                    }
                },
                client: true
            },
        })
        if (!bookingRequest) return notFoundRes("Booking Request")
        if (bookingRequest.status === CANCELED) return NextResponse.json({ msg: 'Booking request already cancelled' }, { status: 400 })
        //return 404 respone if boooking request not found

        const { supplierID, clientID, clientCardID, meetingInfoID, supplier, operator, courseID, card_balance_cost, date, time, note, client } = bookingRequest

        const clientCard = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
        if (!clientCard) return notFoundRes("Client Card")
        //return 404 resposne if card not found

        //create a schedule and update booking request
        const [createSchedule, card, meetingInfo] = await Promise.all([
            prisma.supplierSchedule.create({
                data: {
                    supplier: {
                        connect: {
                            id: supplierID
                        }
                    },
                    date,
                    time,
                    status: 'reserved',
                    clientID,
                    clientUsername: client.username
                }
            }),
            prisma.clientCard.findUnique({
                where: { id: clientCardID }, include: {
                    card: true
                }
            }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } })
        ])
        if (!createSchedule) return badRequestRes("Failed to create schedule")
        if (!card) return notFoundRes("Client Card")
        if (!meetingInfo) return notFoundRes("Meeting Info")

        const today = new Date().toISOString().split('T')[0];

        //make a booking request
        //get the current Date and compare the schedule date
        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
        const scheduleDate = new Date(`${createSchedule.date}T${createSchedule.time}`);

        //check if client card is expired or schedule is passed
        if (currentDate > cardValidityDate || currentDate > scheduleDate) {
            return NextResponse.json(
                {
                    msg: currentDate > cardValidityDate ? 'Card is expired' : 'This schedule already passed',
                },
                { status: 400 }
            );
        }

        if (createSchedule.date === today) {
            // Check if the booking time is at least 3 hours ahead
            const bookingTime = new Date(`${createSchedule.date}T${createSchedule.time}`);
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
        const department = await prisma.department.findUnique({ where: { id: card?.card.departmentID } })
        if (!department) return notFoundRes(DEPARTMENT);
        //if supplierprice not found then it means it's not supported in card used

        const bookingPrice = (Number(card.card.price) / card.card.balance) * card_balance_cost

        //create booking
        const [createBooking, updateBookingRequest] = await Promise.all([
            prisma.booking.create({
                data: {
                    note,
                    status: CONFIRMED,
                    operator,
                    card_balance_cost,
                    supplier_rate: supplier.balance[0].booking_rate,
                    name: '1v1 Class',
                    price: bookingPrice.toFixed(2),
                    card_name: card?.name!,
                    quantity: 1,
                    settlement: today,
                    supplier: { connect: { id: supplierID } },
                    client: { connect: { id: clientID } },
                    schedule: { connect: { id: createSchedule.id } },
                    meeting_info: meetingInfo!,
                    clientCardID,
                    department: { connect: { id: department.id } },
                    course: { connect: { id: courseID } },
                },
            }),
            prisma.bookingRequest.update({
                where: {
                    id: bookingRequest.id
                }, data: {
                    status: CONFIRMED
                }
            })
        ])
        //if booking fails to create return 400 response
        if (!createBooking || !updateBookingRequest) return badRequestRes()

        //reduce client card balance if it's not in fingerpower department
        if (department.name.toLocaleLowerCase() !== 'fingerpower') {
            const reduceCardBalance = await prisma.clientCard.update({
                where: { id: card?.id! },
                data: { balance: card?.balance! - card_balance_cost },
            });
            if (!reduceCardBalance) return badRequestRes();
        }

        //get the supplier balance
        const balance = supplier.balance[0]

        const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
        const currentYear = currentDate.getUTCFullYear();

        // Construct the start and end dates in ISO format
        const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

        //update supplier schedule and retrieve earnings for supplier as well as updating the supplier balance
        const [updateSchedule, updateSupplierBalance, earnings] = await Promise.all([
            //update the schedule to reserved
            prisma.supplierSchedule.update({
                where: { id: createSchedule.id },
                data: {
                    status: 'reserved',
                    clientID: client.id,
                    clientUsername: client.username,
                },
            }),
            prisma.supplierBalance.update({
                //apply the booking rate to supplier balance
                where: { id: balance.id },
                data: {
                    amount: balance.amount + balance.booking_rate
                }
            }),
            prisma.supplierEarnings.findFirst({
                //retrieve earnings for this month
                where:
                {
                    supplierBalanceID: balance.id,
                    rate: balance.booking_rate,
                    created_at: {
                        gte: startDate.toISOString(),
                        lt: endDate.toISOString(),
                    },
                }
            })
        ])
        if (!updateSchedule || !updateSupplierBalance) return badRequestRes();

        //if earnings this month exist update the earnings instead of creating a new data
        if (earnings) {
            const updateSupplierEarnings = await prisma.supplierEarnings.update({
                where: { id: earnings.id },
                data: {
                    amount: earnings.amount + balance.booking_rate,
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

        //send emails to client and supplier
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/request/confirmed`, {
            bookingID: createBooking.id,
            operator: session.user.type
        })

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}