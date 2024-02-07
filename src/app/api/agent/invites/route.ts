import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { AGENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //authorize user
        if (session.user.type === AGENT) {
            //retrieve agent and get all of his invites
            const agent = await prisma.agent.findUnique({
                where: { id: session.user.id },
                select: { invites: true }
            })
            if (!agent) return notFoundRes(AGENT)

            return okayRes(agent.invites)
        }

        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //get agentID in searchParameters
        const agentID = getSearchParams(req, 'agentID')
        if (!agentID) return notFoundRes(AGENT)

        //retrieve agent
        const agent = await prisma.agent.findUnique({
            where: { id: agentID },
            select: {
                invites: {
                    include: {
                        cards: true
                    }
                }
            }
        })
        if (!agent) return notFoundRes(AGENT)
        //return 404 response if not found
        const filterInvites = agent.invites.map(client => ({
            ...client,
            cards: client.cards.length > 0 ? true : false
        }))
        //return 200 response
        return okayRes(filterInvites)

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}