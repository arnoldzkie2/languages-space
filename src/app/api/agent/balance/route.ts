import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { AGENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const agentID = getSearchParams(req, 'agentID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === AGENT) {
            const agent = await prisma.agent.findUnique({ where: { id: session.user.id }, include: { balance: true } })
            if (!agent) return unauthorizedRes()

            return okayRes(agent.balance[0])
        }

        if (agentID) {

            const isAdmin = checkIsAdmin(session.user.type)
            if (!isAdmin) return unauthorizedRes()

            const agent = await prisma.agent.findUnique({ where: { id: agentID }, include: { balance: true } })
            if (!agent) return notFoundRes(AGENT)

            return okayRes(agent.balance[0])
        }

        return notFoundRes(AGENT)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
