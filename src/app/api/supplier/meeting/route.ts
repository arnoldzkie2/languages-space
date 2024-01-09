import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const supplierID = getSearchParams(req, 'supplierID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {
            const supplier = await prisma.supplier.findUnique({
                where: { id: session.user.id }, select: {
                    meeting_info: {
                        select: {
                            meeting_code: true,
                            service: true
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.meeting_info)
        }

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID }, select: {
                    meeting_info: {
                        select: {
                            meeting_code: true,
                            service: true
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.meeting_info)
        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {
    try {

        const { meetingInfo } = await req.json()

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type !== 'supplier') return unauthorizedRes()

        const supplier = await prisma.supplier.findUnique({ where: { id: session.user.id } })
        if (!supplier) return notFoundRes('Supplier')

        const deleteMeeting = await prisma.supplierMeetingInfo.deleteMany({
            where: { supplierID: session.user.id },
        });
        if (!deleteMeeting) return badRequestRes()

        const createdMeetingInfo = await prisma.supplierMeetingInfo.createMany({
            data: meetingInfo.map((info: { service: string, meeting_code: string }) => ({
                service: info.service,
                meeting_code: info.meeting_code,
                supplierID: session.user.id,
            })),
        });
        if (!createdMeetingInfo) return badRequestRes()

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}