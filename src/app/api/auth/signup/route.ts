import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, serverErrorRes } from "@/utils/apiResponse";
import { checkUsername } from "@/utils/checkUser";
import { NextRequest } from "next/server";

interface FormData {
    departmentName: string | null
    agentID: string | null
    username: string
    password: string
}

export const POST = async (req: NextRequest) => {

    try {

        //get the username and password departmentID and agentID
        const { username, password, departmentName, agentID }: FormData = await req.json()

        if (!username || !password) return notFoundRes("Invalid Inputs")

        const existingUsername = await checkUsername(username)
        if (existingUsername) return existRes('Username')

        const createClient = await prisma.client.create({
            data: {
                username, password
            }
        })
        if (!createClient) return badRequestRes("Failed to create client")

        if (departmentName) {

            const department = await prisma.department.findUnique({ where: { name: departmentName } })
            if (!department) return notFoundRes("Department")

            const updateClientDepartment = await prisma.client.update({
                where: { id: createClient.id }, data: {
                    departments: {
                        connect: { id: department.id }
                    }
                }
            })
            if (!updateClientDepartment) return badRequestRes()
        }

        if (agentID) {
            const agent = await prisma.agent.findUnique({ where: { id: agentID } })
            if (!agent) return notFoundRes("Agent")

            const bindClientToAgent = await prisma.client.update({
                where: { id: createClient.id }, data: {
                    agent: {
                        connect: { id: agent.id }
                    }
                }
            })
            if (!bindClientToAgent) return badRequestRes("Failed to bind client to agent")
        }

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}