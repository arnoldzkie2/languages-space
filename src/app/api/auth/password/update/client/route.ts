import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextResponse } from "next/server"

interface FormData {
    newPassword: string
    prevPassword: string
    clientID: string
    type: string
}

export const POST = async (req: Request) => {

    const { newPassword, prevPassword, clientID, type }: FormData = await req.json()

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID } })
            if (!client) return notFoundRes('Client')

            if (client.password === prevPassword) {

                const updateClient = await prisma.client.update({
                    where: { id: client.id }
                    , data: {
                        password: newPassword
                    }
                })
                if (!updateClient) return badRequestRes()

                return okayRes()
            }

            return NextResponse.json({ msg: 'Wrong Password' }, { status: 400 })
        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}