import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { AVAILABLE, CANCELED, CONFIRMED, DEPARTMENT, FINGERPOWER, RESERVED, SUPPLIER } from "@/utils/constants";
import { calculateCommissionPriceQuantitySettlementAndStatus } from "@/utils/getBookingPrice";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        //authorize user
        const session = await getAuth()
        if (!session || session.user.type !== SUPPLIER) return unauthorizedRes()
        // only allow supplier to confirm a request booking
        // get the requestBoookingID in request body
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
        if (bookingRequest.status === CANCELED) return badRequestRes("Booking Request already cancelled")
        if (bookingRequest.status === CONFIRMED) return badRequestRes("Booking Request already confirmed.")
        //return 404 respone if boooking request not found

        const { supplierID, clientID, name, clientCardID,
            meetingInfoID, supplier, operator, courseID,
            card_balance_cost, date, time, note, client,
            client_quantity, supplier_quantity, settlement } = bookingRequest

        const clientCard = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
        if (!clientCard) return notFoundRes("Client Card")
        //return 404 resposne if card not found

        const supplierSchedule = await prisma.supplierSchedule.findFirst({ where: { supplierID, time, date } })

        let scheduleID: string

        if (supplierSchedule) {
            //set the scheduleID to supplierschedule
            scheduleID = supplierSchedule.id
        } else {
            const createSchedule = await prisma.supplierSchedule.create({
                data: {
                    supplier: {
                        connect: {
                            id: supplierID
                        }
                    },
                    date,
                    time,
                    status: AVAILABLE
                }
            })
            if (!createSchedule) return badRequestRes("Failed to create schedule")
            //return 400 response if it fails

            scheduleID = createSchedule.id
        }

        //get a schedule,card,meetignInfo
        const [schedule, card, meetingInfo] = await Promise.all([
            prisma.supplierSchedule.findUnique({ where: { id: scheduleID } }),
            prisma.clientCard.findUnique({
                where: { id: clientCardID }, include: {
                    card: true
                }
            }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meetingInfoID } })
        ])
        if (!schedule) return notFoundRes("Schedule")
        if (!card) return notFoundRes("Client Card")
        if (!meetingInfo) return notFoundRes("Meeting Info")

        // const today = new Date().toISOString().split('T')[0];

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

        //retrieve department and supplierprice
        const [department, supplierPrice] = await Promise.all([
            prisma.department.findUnique({ where: { id: card?.card.departmentID } }),
            prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card.cardID } })
        ])
        if (!department) return notFoundRes(DEPARTMENT);
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' }, { status: 400 });

        //if supplierprice not found then it means it's not supported in card used

        //get this data in this function I made to return the value base on department
        const { bookingPrice, supplierCommission, bookingQuantity, settlementDate, getStatus } = calculateCommissionPriceQuantitySettlementAndStatus({
            balance: supplier.balance,
            supplierPrice,
            supplierQuantity: Number(supplier_quantity),
            department,
            card: card.card,
            clientQuantity: Number(client_quantity),
            settlement,
            status: CONFIRMED
        })
        if (!settlementDate) return notFoundRes("Settlement Date")

        if (bookingQuantity.client <= 0 || bookingQuantity.supplier <= 0) return badRequestRes("Quantity must be positive number")

        //create booking
        const [createBooking, updateBookingRequest] = await Promise.all([
            prisma.booking.create({
                data: {
                    name,
                    note,
                    status: getStatus,
                    operator,
                    card_balance_cost,
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
            }),
            prisma.bookingRequest.update({
                where: {
                    id: bookingRequest.id
                }, data: {
                    status: CONFIRMED,
                    note: 'booking created'
                }
            })
        ])
        //if booking fails to create return 400 response
        if (!createBooking || !updateBookingRequest) return badRequestRes()

        //reduce client card balance if it's not in fingerpower department
        if (department.name.toLocaleLowerCase() !== FINGERPOWER) {

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
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/request/confirmed`, {
            bookingID: createBooking.id,
            operator: SUPPLIER
        })

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}