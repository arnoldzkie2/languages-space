import prisma from "@/lib/db";
import Payslip from "@/lib/emails/Payslip";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { ADMIN, AGENT, SUPERADMIN } from "@/utils/constants";
import resend from "@/utils/getResend";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session || ![SUPERADMIN, ADMIN].includes(session.user.type)) return unauthorizedRes()
        //only superadmin and admin are allowed to proceed 

        const currentDate = new Date()
        //retrieve lastmonth and current year
        const lastMonth = currentDate.getUTCMonth() + 1;
        const currentYear = currentDate.getUTCFullYear();

        //this will get the first day of last mont and last day of last month
        const startDate = new Date(Date.UTC(currentYear, lastMonth - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(currentYear, lastMonth, 0, 23, 59, 59));

        //this is the payslip date lastmonth this format ex:(January 2024)
        const date = new Date(startDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })

        //get all deductions and earnings of supplier last month
        const agentBalance = await prisma.agentBalance.findMany({
            select: {
                id: true,
                currency: true,
                agent: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                deductions: {
                    //get all supplier deductions last month
                    where: {
                        created_at: {
                            gte: startDate.toISOString(),
                            lt: endDate.toISOString(),
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        rate: true,
                        amount: true
                    }
                },
                earnings: {
                    where: {
                        //get all supplier earnings last month
                        created_at: {
                            gte: startDate.toISOString(),
                            lt: endDate.toISOString(),
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        rate: true,
                        amount: true
                    }
                }
            }
        })
        if (!agentBalance) return badRequestRes()

        //send all payslips to all suppliers synchronously
        //sending all emails at once without waiting
        Promise.all(agentBalance.map(async (balance) => {

            //if agent has earnings last month and has email then we send payslip
            if (balance.earnings.length > 0 && balance.agent.email) {
                resend.emails.send({
                    from: 'VerbalAce <support@verbalace.com>',
                    to: balance.agent.email,
                    subject: 'Payslip',
                    react: Payslip({
                        name: balance.agent.username,
                        date, balanceID: balance.id,
                        earnings: balance.earnings,
                        deductions: balance.deductions,
                        currency: balance.currency,
                        position: AGENT.toUpperCase()
                    }),
                    reply_to: 'VerbalAce <support@verbalace.com>'
                });
            }
        }))

        //return 200 response immediately
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}