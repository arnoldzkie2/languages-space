import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const POST = async (req: Request) => {

    const { profile, name, organization, user_name, password, phone_number, email, address, gender, origin, note, departments } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name } }) ||
            await prisma.admin.findUnique({ where: { user_name } }) ||
            await prisma.supplier.findUnique({ where: { user_name } }) ||
            await prisma.agent.findUnique({ where: { user_name } })

        if (existingUsername) return NextResponse.json({ msg: 'user_name_exist' }, { status: 409 })

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

            const newUser = await prisma.client.create({
                data: {
                    profile, name, password, user_name, organization, phone_number, email, address, gender, origin, note, departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }
            })

            if (!newUser) return badRequestRes()

            return createdRes()

        }

        const newUser = await prisma.client.create({
            data: {
                profile, name, password, user_name, organization, phone_number, email, address, gender, origin, note
            }
        })
        if (!newUser) return badRequestRes()

        return createdRes()

    } catch (error) {

        console.log(error);

        return serverErrorRes(error)

    } finally {

        prisma.$disconnect()

    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientID = searchParams.get('clientID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({
                where: { id: clientID },
                include: { departments: true, cards: true }
            });

            if (!client) notFoundRes('Client')

            return okayRes(client)

        }

        if (departmentID) {

            const checkDepartment = await prisma.department.findUnique({ where: { id: departmentID } })

            if (!checkDepartment) return notFoundRes('Department')

            const clientsInDepartment = await prisma.client.findMany({
                where: {
                    departments: {
                        some: {
                            id: departmentID
                        }
                    }
                },
                include: { departments: true, cards: true }
            });

            if (!clientsInDepartment) return badRequestRes()

            return okayRes(clientsInDepartment)

        }

        const allClient = await prisma.client.findMany({ include: { departments: true, cards: true } })

        if (!allClient) return badRequestRes()

        return okayRes(allClient)

    } catch (error) {

        console.log(error);

        return serverErrorRes(error)

    } finally {

        prisma.$disconnect()

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const clientIDS = searchParams.getAll('clientID');

    try {

        if (clientIDS.length > 0) {

            const deleteClients = await prisma.client.deleteMany({

                where: { id: { in: clientIDS } },

            })

            if (!deleteClients) return badRequestRes()

            if (deleteClients.count < 1) return notFoundRes('Client')

            return okayRes(deleteClients)

        }

        return notFoundRes('clientID')

    } catch (error) {

        console.log(error);

        return serverErrorRes(error)

    } finally {

        prisma.$disconnect();
    }
}

export const PATCH = async (req: Request) => {

    const { profile, name, password, organization, user_name, phone_number, email, address, gender, origin, note, departments } = await req.json()

    const { searchParams } = new URL(req.url);

    const clientID = searchParams.get('clientID');

    try {

        const client = await prisma.client.findUnique({ where: { id: String(clientID) }, include: { departments: true } })

        if (!client) return notFoundRes('Client')

        if (client.user_name !== user_name) {

            const existingUsername =
                await prisma.client.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

            if (existingUsername) return existRes('user_name')

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

            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 400 });

            const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));

            const departmentsToRemove = client.departments.filter((department) =>
                !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
            );

            const updatedClient = await prisma.client.update({
                where: {
                    id: String(clientID)
                },
                data: {
                    profile, name, user_name, password, organization, origin, phone_number, email, address, gender, note,
                    departments: {
                        connect: departmentsToConnect,
                        disconnect: departmentsToRemove,
                    },
                },
                include: { departments: true }
            })

            if (!updatedClient) return badRequestRes()

            return okayRes()

        }

        const updatedClient = await prisma.client.update({
            where: {
                id: String(clientID)
            },
            data: {
                profile, name, user_name, password, organization, origin, phone_number, email, address, gender, note
            }
        })

        if (!updatedClient) return badRequestRes()

        return okayRes()


    } catch (error) {

        console.log(error);

        return serverErrorRes(error)

    } finally {

        prisma.$disconnect()

    }
}