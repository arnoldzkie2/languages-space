import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";


export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const supplierID = searchParams.get('supplierID')

    try {

        if (supplierID) {

            const supplierSchedule = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: { meeting_info: true }
            })

            if (!supplierSchedule) return notFoundRes('Supplier')

            return okayRes(supplierSchedule.meeting_info)
        }

        return notFoundRes('supplierID')

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }
}

export const POST = async (req: Request) => {

    const { service, meeting_code, supplierID } = await req.json()

    try {

        const existingMeeting = await prisma.supplierMeetingInfo.findUnique({
            where: { id: supplierID, service, meeting_code }
        })

        if (existingMeeting) return existRes('meeting_info')

        const newMeetingInfo = await prisma.supplierMeetingInfo.create({
            data: { service, meeting_code, supplier: { connect: { id: supplierID } } }
        })

        if (!newMeetingInfo) return badRequestRes()

        return createdRes(newMeetingInfo)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const meetingID = searchParams.get('meetingID')

    const { service, meeting_code, supplierID } = await req.json()

    try {

        if (meetingID) {

            const checkMeeting = await prisma.supplierMeetingInfo.findUnique({ where: { id: meetingID, supplier_id: supplierID } })

            if (!checkMeeting) return notFoundRes('Meeting Info')

            const updateMeeting = await prisma.supplierMeetingInfo.update({
                where: { id: meetingID }, data: { service, meeting_code }
            })

            if (!updateMeeting) return badRequestRes()

            return okayRes(updateMeeting)
        }

        return notFoundRes('meetingID')

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const meetingID = searchParams.get('meetingID')

    try {

        if (meetingID) {

            const checkMeeting = await prisma.supplierMeetingInfo.findUnique({ where: { id: meetingID } })

            if (!checkMeeting) return notFoundRes('Meeting Info')

            const deleteMeeting = await prisma.supplierMeetingInfo.delete({ where: { id: meetingID } })

            if (!deleteMeeting) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('meetingID')

    } catch (error) {

        console.log(error)

        return serverErrorRes()

    }
}