import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, existRes, notFoundRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { CLIENT, CONFIRMED, FINGERPOWER, PENDING, RESERVED, SUPPLIER } from "@/utils/constants";
import { calculateCommissionPriceQuantitySettlementAndStatus } from "@/utils/getBookingPrice";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    try {

        const { remindersID } = await req.json()
        if (!remindersID) return notFoundRes('Reminders')

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        //retrieve reminder
        const reminder = await prisma.reminders.findUnique({
            where: { id: remindersID }
        })
        if (!reminder) return notFoundRes('Reminder')

        const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, name, courseID, client_quantity, supplier_quantity, settlement } = reminder

        if (!clientID) return notFoundRes(CLIENT)
        if (!supplierID) return notFoundRes(SUPPLIER)
        if (!meeting_info) return notFoundRes("Meeting Info")
        if (!clientCardID) return notFoundRes("Client Card")
        if (!scheduleID) return notFoundRes("Schedule")
        if (!settlement) return notFoundRes("Settlement")
        if (!courseID) return notFoundRes("Course")
        const meeting = meeting_info as any

        const [client, supplier, meetingInfo, card, schedule] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meeting.id } }),
            prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
            prisma.supplierSchedule.findUnique({ where: { id: scheduleID } })
        ]);

        if (!client) return notFoundRes('Client')
        if (!supplier) return notFoundRes('Supplier')
        if (!meetingInfo) return notFoundRes('Meeting Info')
        if (!card) return notFoundRes('Card')
        if (!schedule) return notFoundRes("Schedule")

        const currentDate = new Date();
        const cardValidityDate = new Date(card.validity);
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

        const department = await prisma.department.findUnique({ where: { id: card.card.departmentID } });
        if (!department) return notFoundRes('Department');

        const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card.cardID } });
        if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' }, { status: 400 });

        if (card.balance < Number(supplierPrice.price)) {
            return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 });
        }

        //get this data in this function I made to return the value base on department
        const { bookingPrice, bookingQuantity, supplierCommission, settlementDate } = calculateCommissionPriceQuantitySettlementAndStatus({
            balance: supplier.balance,
            supplierPrice,
            supplierQuantity: Number(supplier_quantity),
            department,
            card: card.card,
            clientQuantity: Number(client_quantity),
            settlement,
            status: PENDING
        })

        const createBooking = await prisma.booking.create({
            data: {
                note,
                status: CONFIRMED,
                operator,
                card_balance_cost: Number(supplierPrice.price),
                supplier_rate: supplierCommission,
                name,
                price: bookingPrice.toFixed(2),
                card_name: card.name,
                client_quantity: bookingQuantity.client,
                supplier_quantity: bookingQuantity.supplier,
                settlement: settlementDate,
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

        //reduce client card balance if it's not in fingerpower department
        if (department.name.toLocaleLowerCase() !== FINGERPOWER) {
            const reduceCardBalance = await prisma.clientCard.update({
                where: { id: card.id },
                data: { balance: card.balance - Number(supplierPrice.price) },
            });
            if (!reduceCardBalance) return badRequestRes();
        }

        //update supplier schedule and create earnings for supplier as well as updating the supplier balance

        const balance = supplier.balance[0]

        const currentMonth = currentDate.getUTCMonth() + 1; // Adjust month to be in the range 1 to 12
        const currentYear = currentDate.getUTCFullYear();

        // Construct the start and end dates in ISO format
        const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));

        const [updateSchedule, earnings, updateSupplierBalance, updateReminder] = await Promise.all([
            prisma.supplierSchedule.update({
                where: { id: schedule.id },
                data: {
                    status: RESERVED,
                    clientID: client?.id,
                    clientUsername: client?.username,
                },
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
            }),
            prisma.supplierBalance.update({
                where: { id: supplier?.balance[0].id }, data: {
                    amount: Number(balance.amount) + balance.booking_rate
                }
            }),
            prisma.reminders.update({
                where: {
                    id: reminder.id
                }, data: {
                    status: CONFIRMED,
                    note: 'booking created'
                }
            })
        ])
        if (!updateSchedule || !updateSupplierBalance || !updateReminder) return badRequestRes();

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

        //send emails to client and supplier
        axios.post(`${process.env.NEXTAUTH_URL}/api/email/booking/created`, {
            bookingID: createBooking.id, operator
        })

        //return 201 response
        return createdRes();

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}