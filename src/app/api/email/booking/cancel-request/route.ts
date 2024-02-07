import prisma from "@/lib/db";
import NotifyAdminBookingCancelRequest from "@/lib/emails/NotifyAdminBookingCancelRequest";
import { notFoundRes, serverErrorRes } from "@/utils/apiResponse";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const { bookingID, operator } = await req.json()

        if (!bookingID) return notFoundRes("Booking")

        const booking = await prisma.booking.findUnique({
            where: { id: bookingID },
            include: {
                client: true,
                schedule: true,
                supplier: true,
                course: true
            }
        })
        if (!booking) return notFoundRes("Booking")

        const adminsWithEmailPermission = await prisma.admin.findMany({
            where: {
                department_permission: {
                    some: {
                        id: booking.departmentID,
                        admin_permissions: {
                            some: {
                                receive_cancel_request_email: true
                            }
                        }
                    }
                },
            }
        });

        const { client, supplier, schedule, course, meeting_info } = booking

        Promise.all(adminsWithEmailPermission.map(async (admin) => {
            if (admin.email && booking.note) {
                resend.emails.send({
                    from: 'VerbalAce <support@verbalace.com>',
                    to: admin.email,
                    subject: `Booking Request To Cancel`,
                    react: NotifyAdminBookingCancelRequest({
                        adminUsername: admin.username,
                        supplierUsername: supplier.username,
                        clientUsername: client.username,
                        note: booking.note,
                        operator,
                        schedule: {
                            date: schedule.date,
                            time: schedule.time
                        },
                        course: course.name,
                        meetingInfo: meeting_info as {
                            id: string,
                            service: string,
                            meeting_code: string
                        }
                    }),
                    reply_to: 'VerbalAce <support@verbalace.com>'
                })
            }
        }))

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}