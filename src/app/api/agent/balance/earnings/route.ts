import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { AGENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {
        //authorized user
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //if user is agent proceed to this if statement
        if (session.user.type === AGENT) {

            //retrieve agent and get the earnings
            const agent = await prisma.agent.findUnique({
                where: { id: session.user.id },
                include:
                {
                    balance: {
                        include: {
                            earnings: {
                                orderBy: { created_at: 'desc' }
                            }
                        }
                    }
                }
            })
            if (!agent) return notFoundRes(AGENT)
            //return 404 if agent does not exist

            //return 200 response and pass agent earnings
            return okayRes(agent.balance[0].earnings)

        }

        //get agentID
        const agentID = getSearchParams(req, 'agentID')

        //return 404 if agentID not passed
        if (!agentID) return notFoundRes(AGENT)

        //only admin are allowed to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //check agent get earnings
        const agent = await prisma.agent.findUnique({
            where: { id: agentID },
            include: {
                balance: {
                    include: {
                        earnings: {
                            orderBy: { created_at: 'desc' }
                        }
                    }
                }
            }
        })
        if (!agent) return notFoundRes(AGENT)
        //return 404 response if agent does not exist 

        //return 200 response and pass agent earnings
        return okayRes(agent.balance[0].earnings)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {

    try {

        //authorized user
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //get the data we need
        const { name, quantity, agentID, rate } = await req.json()

        //check one of them if exist
        if (!name) return notFoundRes('Name')
        if (!quantity) return notFoundRes('Quantity')
        if (!agentID) return notFoundRes(AGENT)
        if (!rate) return notFoundRes('Rate')

        //only admin are allowed to proceed
        const isAdmin = await checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //check agent and include balance
        const agent = await prisma.agent.findUnique({ where: { id: agentID }, include: { balance: true } })
        if (!agent) return notFoundRes(AGENT)
        //return 404 if agent not found

        //calculate the amount
        const amount = Number(quantity) * Number(rate)

        //update agent balance and create earnings
        const [updateAgentBalance, createEarnings] = await Promise.all([
            prisma.agentBalance.update({
                where: { id: agent.balance[0].id }, data: {
                    amount: Number(agent.balance[0].amount) + amount
                }
            }),
            prisma.agentEarnings.create({
                data: {
                    name, quantity: Number(quantity),
                    rate: Number(rate), amount,
                    balance: { connect: { id: agent.balance[0].id } }
                }
            })
        ])
        //if one of them fails return 400 response
        if (!updateAgentBalance || !createEarnings) return badRequestRes()

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed

        //get all earningsID in searchParams
        const { searchParams } = new URL(req.url)
        const earningsIds = searchParams.getAll("earningsID")

        if (earningsIds.length > 0) {
            const deleteDeductions = await prisma.agentEarnings.deleteMany({
                where: { id: { in: earningsIds } }
            })
            if (deleteDeductions.count === 0) return notFoundRes("Earnings")

            return okayRes()
        }

        return notFoundRes("Earnings")

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}