import prisma from "@/lib/db";
import { notFoundRes, badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { AGENT } from "@/utils/constants";
import { UTApi } from "uploadthing/server";

interface Props {
    profile: {
        key: string
        url: string
    }
    agentID: string
}


export const POST = async (req: Request) => {

    const { profile, agentID }: Props = await req.json()

    try {

        const utapi = new UTApi()

        if (agentID) {

            const agent = await prisma.agent.findUnique({ where: { id: agentID } })
            if (!agent) return notFoundRes('Supplier')

            if (agent.profile_key) {
                const deleteProfile = await utapi.deleteFiles(agent.profile_key)
                if (!deleteProfile) return badRequestRes()
            }

            const updateSupplierProfile = await prisma.agent.update({
                where: { id: agent.id }, data: { profile_key: profile.key, profile_url: profile.url }
            })
            if (!updateSupplierProfile) return badRequestRes()

            return okayRes()

        }

        return notFoundRes(AGENT)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}