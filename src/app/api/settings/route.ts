import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { Settings } from "@prisma/client";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getAuth()
        if (!session) return unauthorizedRes()

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const settings = await prisma.settings.findMany()

        return okayRes(settings[0])

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        await prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //check if user is admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const newSettingsData: Settings = await req.json()

        //retrieve settings and update it
        const settings = await prisma.settings.findMany()

        const updateSettings = await prisma.settings.update({
            where: { id: settings[0].id }, data: newSettingsData
        })
        if (!updateSettings) return badRequestRes("Failed to update settings")
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        await prisma.$disconnect()
    }
}