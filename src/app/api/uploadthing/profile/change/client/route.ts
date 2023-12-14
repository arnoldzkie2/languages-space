import prisma from "@/lib/db";
import { notFoundRes, badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { UTApi } from "uploadthing/server";

interface Props {
    profile: {
        key: string
        url: string
    }
    clientID: string
}


export const POST = async (req: Request) => {

    const { profile, clientID }: Props = await req.json()

    try {

        const utapi = new UTApi()

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID } })
            if (!client) return notFoundRes('Client')

            if (client.profile_key) {

                const clientProfile = await utapi.getFileUrls(client.profile_key)

                if (clientProfile) {

                    const deleteProfile = await utapi.deleteFiles(client.profile_key)
                    if (!deleteProfile) return badRequestRes()

                }
            }

            const updateClientProfile = await prisma.client.update({
                where: { id: client.id }, data: { profile_key: profile.key, profile_url: profile.url }
            })
            if (!updateClientProfile) return badRequestRes()


            return okayRes()

        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}