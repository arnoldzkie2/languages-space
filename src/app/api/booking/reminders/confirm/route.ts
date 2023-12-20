import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, serverErrorRes } from "@/utils/apiResponse";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

    const { remindersID } = await req.json()
    try {

        if (remindersID) {

            const reminder = await prisma.reminders.findUnique({
                where: { id: remindersID }
            })
            if (!reminder) return notFoundRes('Reminder')

            const { scheduleID, supplierID, clientID, note, operator, meeting_info, clientCardID, status, name, courseID, departmentID, quantity, settlement }: any = reminder

            const checkNotFound = (entity: string, value: any) => {
                if (!value) return notFoundRes(entity);
            }

            const params = [scheduleID, name, supplierID, clientID, clientCardID, settlement, operator, meeting_info]
            params.forEach((param, index) =>
                checkNotFound(['Schedule', 'Booking name', 'Supplier', 'Client', 'Card', 'Settlement period', 'Operator', 'Meeting info'][index], param)
            );

            const schedule = await prisma.supplierSchedule.findUnique({ where: { id: scheduleID } });
            if (!schedule || schedule.status === 'reserved') return notFoundRes('Schedule');

            const [client, supplier, meetingInfo, card] = await Promise.all([
                prisma.client.findUnique({ where: { id: clientID } }),
                prisma.supplier.findUnique({ where: { id: supplierID } }),
                prisma.supplierMeetingInfo.findUnique({ where: { id: meeting_info.id } }),
                prisma.clientCard.findUnique({ where: { id: clientCardID }, include: { card: true } }),
            ]);

            [client, supplier, meetingInfo, card].forEach((entity, index) =>
                checkNotFound(['Client', 'Supplier', 'Meeting info in supplier', 'Client Card'][index], entity)
            );

            const course = await prisma.courses.findUnique({ where: { id: courseID } })
            if (!course) return notFoundRes('Course')

            if (schedule.status === 'reserved') return NextResponse.json({ msg: 'This schedule is already reserved' }, { status: 409 })

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

            const supplierPrice = await prisma.supplierPrice.findFirst({ where: { supplierID, cardID: card?.cardID } })
            if (!supplierPrice) return NextResponse.json({ msg: 'Supplier is not supported in this card' }, { status: 400 })
            if (card?.balance! < supplierPrice.price) return NextResponse.json({ msg: 'Not enough balance to book' }, { status: 400 })

            const department = await prisma.department.findUnique({ where: { id: card?.card.departmentID } });
            if (!department) return notFoundRes('Department');


            const bookingPrice =
                department.name.toLocaleLowerCase() === 'fingerpower'
                    ? quantity * card?.card.price!
                    : (card?.card.price! / card?.card.balance!) * supplierPrice.price;

            //create booking
            const createBooking = await prisma.booking.create({
                data: {
                    note, status, operator, name, price: bookingPrice, card_name: card?.name!, quantity, settlement,
                    supplier: { connect: { id: supplierID } },
                    client: { connect: { id: clientID } },
                    schedule: { connect: { id: scheduleID } },
                    meeting_info: meetingInfo!, clientCardID,
                    department: { connect: { id: departmentID } },
                    course: { connect: { id: courseID } }
                },
            })
            if (!createBooking) return badRequestRes()

            //reduce client card balance if it's not in fingerpower department
            if (department.name.toLocaleLowerCase() !== 'fingerpower') {
                const reduceCardBalance = await prisma.clientCard.update({
                    where: { id: card?.id! },
                    data: { balance: card?.balance! - supplierPrice.price },
                });
                if (!reduceCardBalance) return badRequestRes();
            }
            //update the schedule
            const updateSchedule = await prisma.supplierSchedule.update({
                where: { id: scheduleID },
                data: {
                    status: 'reserved',
                    clientID: client?.id,
                    clientUsername: client?.name
                }
            })
            if (!updateSchedule) return badRequestRes()

            const updateReminders = await prisma.reminders.update({ where: { id: reminder.id }, data: { status: 'booked' } })
            if (!updateReminders) return badRequestRes()

            return createdRes(createBooking.id)

        }

        return notFoundRes('Reminder')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}