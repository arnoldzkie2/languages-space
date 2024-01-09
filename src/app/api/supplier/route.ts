import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { getAuth } from "@/lib/nextAuth";

export const POST = async (req: Request) => {

    const { name, username, password, organization, payment_address, payment_schedule, phone_number,
        profile_key, profile_url, currency, email, address, gender, card, origin,
        tags, note, employment_status, meeting_info, entry, departure, booking_rate,
        departments, salary } = await req.json()

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        if (!username || !password || !name) return badRequestRes()

        const existingUsername =
            await prisma.client.findUnique({ where: { username } }) ||
            await prisma.superAdmin.findUnique({ where: { username } }) ||
            await prisma.admin.findUnique({ where: { username } }) ||
            await prisma.supplier.findUnique({ where: { username } }) ||
            await prisma.agent.findUnique({ where: { username } })

        if (existingUsername) return existRes('username')

        const newSupplier = await prisma.supplier.create({
            data: {
                name, username, password, organization, phone_number, email, address, gender, card,
                origin, tags, note, employment_status, entry, departure, profile_key, profile_url,
                balance: {
                    create: {
                        amount: 0,
                        currency,
                        booking_rate: Number(booking_rate),
                        salary: Number(salary),
                        payment_address,
                        payment_schedule
                    }
                }
            }, include: { meeting_info: true, balance: true }
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
            }
        }

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

            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 404 });

            const updateSupplierDepartment = await prisma.supplier.update({
                where: { id: newSupplier.id }, data: {
                    departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }
            })
            if (!updateSupplierDepartment) return badRequestRes()
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

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                include: { departments: true, meeting_info: true, balance: true }
            })
            if (!supplier) notFoundRes('Supplier')

            return okayRes(supplier)

        }

        if (departmentID) {

            const suppliers = await prisma.supplier.findMany({
                where: {
                    departments: {
                        some: {
                            id: departmentID
                        }
                    }
                }, include: { departments: true },
                orderBy: { created_at: 'desc' }
            })
            if (!suppliers) return badRequestRes()

            return okayRes(suppliers)

        }

        const allSupplier = await prisma.supplier.findMany({ include: { departments: true }, orderBy: { created_at: 'desc' } })
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

    const { name, username, password, organization, payment_address, payment_schedule, phone_number, email, address, gender, profile_key, profile_url,
        card, origin, tags, note, employment_status, entry, departure, departments, meeting_info, currency, salary, booking_rate } = await req.json()

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {

            if (session.user.username !== username && username) {

                const existingUsername =
                    await prisma.client.findUnique({ where: { username } }) ||
                    await prisma.superAdmin.findUnique({ where: { username } }) ||
                    await prisma.admin.findUnique({ where: { username } }) ||
                    await prisma.supplier.findUnique({ where: { username } }) ||
                    await prisma.agent.findUnique({ where: { username } })
                if (existingUsername) return existRes('Username')

            }

            const supplier = await prisma.supplier.update({
                where: { id: session.user.id }, data: {
                    name, username, password, email, phone_number, address, gender, tags
                }, include: { balance: true }
            })
            if (!supplier) return badRequestRes()

            if (payment_address) {
                const updatePaymentInfo = await prisma.supplierBalance.update({
                    where: {
                        id: supplier.balance[0].id
                    }, data: { payment_address }
                })
                if (!updatePaymentInfo) return badRequestRes()
            }

            return okayRes()
        }

        if (supplierID) {

            if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                include: { departments: true, meeting_info: true, balance: true }
            })
            if (!supplier) return notFoundRes('Supplier')

            if (meeting_info && meeting_info.length > 0) {

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
                    )

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
            }

            if (departments && departments.length > 0) {

                const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));

                const departmentsToRemove = supplier.departments.filter((department) =>
                    !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
                )

                const updatedSupplier = await prisma.supplier.update({
                    where: { id: supplierID },
                    data: {
                        name, username, password, organization, phone_number, email, address, gender,
                        card, origin, tags, note, employment_status, entry, departure, profile_key, profile_url,
                        balance: {
                            update: {
                                where: { id: supplier.balance[0].id },
                                data: { payment_address, payment_schedule, currency, salary: Number(salary), booking_rate: Number(booking_rate) }
                            }
                        },
                        departments: { connect: departmentsToConnect, disconnect: departmentsToRemove },
                    }
                })
                if (!updatedSupplier) return badRequestRes()

                return okayRes()
            }

            const updatedSupplier = await prisma.supplier.update({
                where: { id: supplierID },
                data: {
                    name, username, password, organization, phone_number, email, address, gender,
                    card, origin, tags, note, employment_status, entry, departure, profile_key, profile_url,
                    balance: {
                        update: {
                            where: { id: supplier.balance[0].id },
                            data: { payment_address, payment_schedule, currency, salary: Number(salary), booking_rate: Number(booking_rate) }
                        }
                    },
                }
            })
            if (!updatedSupplier) return badRequestRes()

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

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll('supplierID');

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

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




