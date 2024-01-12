import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { AGENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        //get the agentID
        const agentID = getSearchParams(req, 'agentID')

        //check if user is logged in
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //if user is agent proceed to this if statement
        if (session.user.type === AGENT) {

            const agent = await prisma.agent.findUnique({
                where: { id: session.user.id },
                include:
                {
                    balance: {
                        include: {
                            deductions: {
                                orderBy: { created_at: 'desc' }
                            }
                        }
                    }
                }
            })
            if (!agent) return notFoundRes(AGENT)
            //return 404 if agent not found

            //return the agent deductions
            return okayRes(agent.balance[0].deductions)

        }

        //if agentID not passed return 404
        if (!agentID) return notFoundRes(AGENT)

        //only admin are allowed to proceed
        const isAdmin = await checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //check agent
        const agent = await prisma.agent.findUnique({
            where: { id: agentID },
            include: {
                balance: {
                    include: {
                        deductions: {
                            orderBy: { created_at: 'desc' }
                        }
                    }
                }
            }
        })
        if (!agent) return notFoundRes(AGENT)
        //return 404 if agent not found

        //return agent deductions
        return okayRes(agent.balance[0].deductions)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {

    try {

        //authorize user
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //get all data we need
        const { name, quantity, agentID, rate } = await req.json()

        //check one if them if exist
        if (!name) return notFoundRes('Name')
        if (!quantity) return notFoundRes('Quantity')
        if (!agentID) return notFoundRes(AGENT)
        if (!rate) return notFoundRes('Rate')

        //only admin are allowed to proceed
        const isAdmin = await checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //retrieve agent
        const agent = await prisma.agent.findUnique({ where: { id: agentID }, include: { balance: true } })
        if (!agent) return notFoundRes(AGENT)
        //return 404 if agent does not exist


        //calculate the amount
        const amount = Number(quantity) * Number(rate)

        //update the agentbalance and create deductions all at once
        const [updateAgentBalance, createDeductions] = await Promise.all([
            prisma.agentBalance.update({
                where: { id: agent.balance[0].id }, data: {
                    amount: agent.balance[0].amount - amount
                }
            }),
            prisma.agentDeductions.create({
                data: {
                    name, quantity: Number(quantity),
                    rate: Number(rate), amount,
                    balance: { connect: { id: agent.balance[0].id } }
                }
            })
        ])
        //if one of them fails return 400 response
        if (!updateAgentBalance || !createDeductions) return badRequestRes()

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}