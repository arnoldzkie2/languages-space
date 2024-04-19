import prisma from "@/lib/db";
import PublishNewsContent from "@/lib/emails/PublishedNewsContent";
import { okayRes, serverErrorRes } from "@/utils/apiResponse";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        //get all admin that has 
        const admin = await prisma.admin.findMany({
            where: {
                department_permission: {
                    some: {
                        admin_permissions: {
                            some: {
                                OR: [
                                    { create_news: true },
                                    { view_news: true },
                                    { update_news: true },
                                    { modify_published_news: true },
                                    { delete_news: true }
                                ]
                            }
                        }
                    }
                }
            }
        })

        Promise.all(admin.map(async (admin) => {
            if (admin.email) {

                resend.emails.send({
                    from: `VerbalAce <support@verbalace.com>`,
                    to: admin.email,
                    subject: 'Action Required: Increase Published News Content',
                    react: PublishNewsContent({ name: admin.name }),
                    reply_to: `Verbalace <support@verbalace.com>`
                })
            }

        }))

        return okayRes()


    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        await prisma.$disconnect()
    }
}