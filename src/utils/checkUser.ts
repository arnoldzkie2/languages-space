import prisma from "@/lib/db"
import { ADMIN, SUPERADMIN } from "./constants"

const checkUsername = async (username: string) => {

    //check username in all users at once

    const [client, supplier, admin, agent, superAdmin] = await Promise.all([
        prisma.client.findUnique({ where: { username } }),
        prisma.supplier.findUnique({ where: { username } }),
        prisma.admin.findUnique({ where: { username } }),
        prisma.agent.findUnique({ where: { username } }),
        prisma.superAdmin.findUnique({ where: { username } }),
    ])

    //if username already exist in other users return 409 response
    if (client || supplier || admin || agent || superAdmin) return true

}

const checkIsAdmin = (type: string) => {
    //check if usertype is admin or superadmin return true else return  false
    if (type === ADMIN || type === SUPERADMIN) return true
    return false
}

export { checkUsername, checkIsAdmin }