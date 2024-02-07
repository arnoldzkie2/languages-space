import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { AGENT } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session || session.user.type !== AGENT) return unauthorizedRes()
        //only allow agent to proceed

        //retrieve agent
        const agent = await prisma.agent.findUnique({
            where: { id: session.user.id },
            select: { departments: true }
        })
        if (!agent) return notFoundRes(AGENT)
        //return    400 respone if fails

        //return 200 response nad pass agent departments
        return okayRes(agent.departments)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}