import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, existRes, notFoundRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { remindersID } = await req.json()
    try {

        if (!remindersID) return notFoundRes('Reminders')

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        const reminder = await prisma.reminders.findUnique({
            where: { id: remindersID }
        })
        if (!reminder) return notFoundRes('Reminder')

        const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, quantity, settlement }: any = reminder

        const checkNotFound = (entity: string, value: any) => {
            if (!value) return notFoundRes(entity);
        }

        const params = [scheduleID, name, supplierID, clientID, clientCardID, settlement, operator, meeting_info]
        params.forEach((param, index) =>
            checkNotFound(['Schedule', 'Booking name', 'Supplier', 'Client', 'Card', 'Settlement period', 'Operator', 'Meeting info'][index], param)
        )

        const [client, supplier, meetingInfo, card, schedule] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } }),
            prisma.supplierMeetingInfo.findUnique({ where: { id: meeting_info.id } }),
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

        const bookingPrice =
            department.name.toLocaleLowerCase() === 'fingerpower'
                ? Number(quantity) * Number(card?.card.price!)
                : (Number(card?.card.price!) / card?.card.balance!) * supplierPrice.price;

        const createBooking = await prisma.booking.create({
            data: {
                note,
                status,
                operator,
                card_balance_cost: supplierPrice.price,
                supplier_rate: supplier.balance[0].booking_rate,
                name,
                price: bookingPrice,
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
        if (!createBooking) return badRequestRes();

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
                    name: 'Class',
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
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}