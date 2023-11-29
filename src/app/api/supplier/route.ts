import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";

export const POST = async (req: Request) => {

    const { name, username, password, organization, payment_info, phone_number, profile_key, profile_url, email, address, gender, card, origin,
        tags, note, employment_status, meeting_info, entry, departure, departments } = await req.json()

    try {

        if (!username || !password || !name) return badRequestRes()

        const existingUsername =
            await prisma.client.findUnique({ where: { username } }) ||
            await prisma.superAdmin.findUnique({ where: { username } }) ||
            await prisma.admin.findUnique({ where: { username } }) ||
            await prisma.supplier.findUnique({ where: { username } }) ||
            await prisma.agent.findUnique({ where: { username } })

        if (existingUsername) return existRes('username')

        if (departments && departments.length > 0) {

            const checkDepartments = await prisma.department.findMany({
                where: {
                    id: {
                        in: departments
                    }
                }
            })

            const existingDepartmentIds = checkDepartments.map(department => department.id);
            const nonExistingDepartmentIds = departments.filter((id: string) => !existingDepartmentIds.includes(id));

            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 400 });

            const newSupplier = await prisma.supplier.create({
                data: {
                    name, username, password, organization, payment_info, phone_number, email, address, gender, card, profile_key, profile_url,
                    origin, tags, note, employment_status, entry, departure, departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }, include: { meeting_info: true }
            })

            if (!newSupplier) return badRequestRes()

            if (meeting_info.length > 0) {

                const meetingInfoData = meeting_info
                    .filter((item: any) => item.service !== '' && item.meeting_code !== '')
                    .map((item: any) => ({
                        service: item.service,
                        meeting_code: item.meeting_code,
                        supplierID: newSupplier.id
                    }))

                if (meetingInfoData.length > 0) {
                    const createMeetingInfo = await prisma.supplierMeetingInfo.createMany({
                        data: meetingInfoData
                    });
                    if (!createMeetingInfo) return badRequestRes();

                    return createdRes(newSupplier);
                }
            }

            return createdRes(newSupplier)

        }

        const newSupplier = await prisma.supplier.create({
            data: {
                name, username, password, organization, payment_info, phone_number, email, address, gender, card,
                origin, tags, note, employment_status, entry, departure, profile_key, profile_url
            }, include: { meeting_info: true }
        })
        if (!newSupplier) return badRequestRes()

        if (meeting_info.length > 0) {

            const meetingInfoData = meeting_info
                .filter((item: any) => item.service !== '' && item.meeting_code !== '')
                .map((item: any) => ({
                    service: item.service,
                    meeting_code: item.meeting_code,
                    supplierID: newSupplier.id
                }))

            if (meetingInfoData.length > 0) {
                const createMeetingInfo = await prisma.supplierMeetingInfo.createMany({
                    data: meetingInfoData
                });
                if (!createMeetingInfo) return badRequestRes();

                return createdRes(newSupplier)
            }
        }

        return createdRes(newSupplier)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (supplierID) {

            const singleSupplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                include: { departments: true, meeting_info: true }
            })
            if (!singleSupplier) notFoundRes('Supplier')

            return okayRes(singleSupplier)

        }

        if (departmentID) {

            const suppliers = await prisma.supplier.findMany({
                where: {
                    departments: {
                        some: {
                            id: departmentID
                        }
                    }
                }, include: { departments: true }
            })
            if (!suppliers) return badRequestRes()

            return okayRes(suppliers)

        }

        const allSupplier = await prisma.supplier.findMany({ include: { departments: true } })
        if (!allSupplier) badRequestRes()

        return okayRes(allSupplier)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: Request) => {

    const { name, username, password, organization, payment_info, phone_number, email, address, gender, profile_key, profile_url,
        card, origin, tags, note, employment_status, entry, departure, departments, meeting_info } = await req.json()

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')

    try {

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                include: { departments: true, meeting_info: true }
            })
            if (!supplier) return notFoundRes('Supplier')

            const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));

            const departmentsToRemove = supplier.departments.filter((department) =>
                !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
            )

            const meetingInfoToDeleteIDs = supplier.meeting_info
                .filter(existingInfo =>
                    !meeting_info.some((newInfo: any) =>
                        newInfo.service === existingInfo.service && newInfo.meeting_code === existingInfo.meeting_code
                    )
                )
                .map(existingInfo => existingInfo.id)

            const meetingInfoToCreate = meeting_info
                .filter((newInfo: any) =>
                    !supplier.meeting_info.some(existingInfo =>
                        newInfo.service === existingInfo.service && newInfo.meeting_code === existingInfo.meeting_code
                    )
                );

            //delete the unused supplier meeting info
            await prisma.supplierMeetingInfo.deleteMany({ where: { id: { in: meetingInfoToDeleteIDs } } });

            // create a new supplier meeting info
            await prisma.supplierMeetingInfo.createMany({
                data: meetingInfoToCreate.map((newInfo: any) => ({
                    supplierID: supplier.id,
                    service: newInfo.service,
                    meeting_code: newInfo.meeting_code,
                }))
            });

            //udpate the supplier
            const updatedSupplier = await prisma.supplier.update({
                where: { id: supplierID },
                data: {
                    name, username, password, organization, payment_info, phone_number, email, address, gender,
                    card, origin, tags, note, employment_status, entry, departure, profile_key, profile_url,
                    departments: { connect: departmentsToConnect, disconnect: departmentsToRemove },
                },
                include: { departments: true, meeting_info: true }
            });
            if (!updatedSupplier) return badRequestRes()

            return okayRes(updatedSupplier)

        }

        return notFoundRes('supplierID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll('supplierID');

    try {

        if (ids.length > 0) {

            const deleteSupplier = await prisma.supplier.deleteMany({
                where: { id: { in: ids } },
            })
            if (deleteSupplier.count === 0) return notFoundRes('Supplier')

            return okayRes(deleteSupplier)
        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
}




