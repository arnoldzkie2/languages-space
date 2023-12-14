import prisma from "@/lib/db";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const supplierID = getSearchParams(req, 'supplierID')

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

        const supplierID = getSearchParams(req, 'supplierID')
        const { meetingInfo } = await req.json()

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            const deleteMeeting = await prisma.supplierMeetingInfo.deleteMany({
                where: { supplierID: supplierID },
            });
            if (!deleteMeeting) return badRequestRes()

            const createdMeetingInfo = await prisma.supplierMeetingInfo.createMany({
                data: meetingInfo.map((info: { service: string, meeting_code: string }) => ({
                    service: info.service,
                    meeting_code: info.meeting_code,
                    supplierID: supplierID,
                })),
            });
            if (!createdMeetingInfo) return badRequestRes()

            return okayRes()
        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}