import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";

interface FormData {
    profile_key: string
    profile_url: string
    name: string
    organization: string
    username: string
    password: string
    phone_number: string
    email: string
    address: string
    gender: string
    origin: string
    note: string
    departments: string[]
}

export const POST = async (req: NextRequest) => {

    const { profile_key, profile_url, name, organization, username, password, phone_number, email, address, gender, origin, note, departments }: FormData = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { username } }) ||
            await prisma.superAdmin.findUnique({ where: { username } }) ||
            await prisma.admin.findUnique({ where: { username } }) ||
            await prisma.supplier.findUnique({ where: { username } }) ||
            await prisma.agent.findUnique({ where: { username } })

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
                    profile_key, profile_url, name, password, username, organization, phone_number, email, address, gender, origin, note, departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }
            })

            if (!newUser) return badRequestRes()

            return createdRes()

        }

        const newUser = await prisma.client.create({
            data: {
                profile_key, profile_url, name, password, username, organization, phone_number, email, address, gender, origin, note
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

export const GET = async (req: NextRequest) => {

    const clientID = getSearchParams(req, 'clientID')
    const departmentID = getSearchParams(req, 'departmentID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({
                where: { id: clientID }
            })

            if (!client) notFoundRes('Client')

            return okayRes(client)

        }

        if (departmentID) {

            const clientsInDepartment = await prisma.department.findUnique({
                where: { id: departmentID }, include: {
                    clients: {
                        include: {
                            departments: {
                                select: { id: true, name: true }
                            }, cards: {
                                select: {
                                    validity: true
                                }
                            }
                        }
                    }
                }
            })

            if (!clientsInDepartment) return notFoundRes('Department')

            return okayRes(clientsInDepartment.clients)

        }

        const allClient = await prisma.client.findMany({
            include: {
                departments: {
                    select: {
                        id: true,
                        name: true
                    }
                }, cards: {
                    select: {
                        validity: true
                    }
                }
            }
        })

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

export const PATCH = async (req: NextRequest) => {

    const { name, password, organization, username, phone_number, email, address, gender, origin, note, departments }: FormData = await req.json()
    const clientID = getSearchParams(req, 'clientID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
            if (!client) return notFoundRes('Client')

            if (client.username !== username) {

                const existingUsername =
                    await prisma.client.findUnique({ where: { username: String(username) } }) ||
                    await prisma.superAdmin.findUnique({ where: { username: String(username) } }) ||
                    await prisma.admin.findUnique({ where: { username: String(username) } }) ||
                    await prisma.supplier.findUnique({ where: { username: String(username) } }) ||
                    await prisma.agent.findUnique({ where: { username: String(username) } })
                if (existingUsername) return existRes('Username')

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
                        name, username, password, organization, origin, phone_number, email, address, gender, note,
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
                    name, username, password, organization, origin, phone_number, email, address, gender, note
                }
            })
            if (!updatedClient) return badRequestRes()

            return okayRes()
        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}