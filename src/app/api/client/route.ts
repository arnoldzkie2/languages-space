import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { getAuth } from "@/lib/nextAuth";
import { checkIsAdmin, checkUsername } from "@/utils/checkUser";
import { CLIENT } from "@/utils/constants";

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

    try {

        //get all dataw
        const { profile_key, profile_url, name, organization, username, password, phone_number, email, address, gender, origin, note, departments }: FormData = await req.json()

        //check if username exist
        const existingUsername = await checkUsername(username)
        if (existingUsername) return existRes('Username')

        //create client
        const createClient = await prisma.client.create({
            data: {
                profile_key, profile_url, name, password, username, organization, phone_number, email, address, gender, origin, note
            }
        })
        if (!createClient) return badRequestRes("Failed to create client")
        //return 400 respone if it fails to create

        //if department is passed
        if (departments && departments.length > 0) {

            //check departments
            const checkDepartments = await prisma.department.findMany({
                where: {
                    id: {
                        in: departments
                    }
                }
            })

            const existingDepartmentIds = checkDepartments.map(department => department.id);
            const nonExistingDepartmentIds = departments.filter((id: string) => !existingDepartmentIds.includes(id));

            //return 404 if some department does not found
            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 404 });

            //update the client departments
            const updateClientDepartment = await prisma.client.update({
                where: { id: createClient.id }, data: {
                    departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }
            })
            if (!updateClientDepartment) return badRequestRes("Failed to update client departments")
            //return 400 response if it fails
        }

        //return 201 response
        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        const isAdmin = await checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only admin are allowed to proceed
        const clientID = getSearchParams(req, 'clientID')
        const departmentID = getSearchParams(req, 'departmentID')

        if (clientID) {

            const client = await prisma.client.findUnique({
                where: { id: clientID }, include: {
                    departments: true
                }
            })
            if (!client) notFoundRes('Client')
            return okayRes(client)
        }

        if (departmentID) {

            const department = await prisma.department.findUnique({
                where: { id: departmentID }, include: {
                    clients: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            phone_number: true,
                            organization: true,
                            origin: true,
                            created_at: true,
                            note: true,
                            cards: true,
                            orders: true,
                            agent: {
                                select: {
                                    username: true
                                }
                            }
                        },

                    }
                }
            })

            if (!department) return notFoundRes('Department')

            const filterClients = department.clients.map(client => ({
                ...client,
                cards: client.cards.length > 0 ? true : false,
                orders: client.orders.length > 0 ? true : false
            }))

            return okayRes(filterClients)

        }

        const allClient = await prisma.client.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                phone_number: true,
                organization: true,
                origin: true,
                created_at: true,
                note: true,
                cards: true,
                orders: true,
                agent: {
                    select: {
                        username: true
                    }
                }
            },

        })

        if (!allClient) return badRequestRes()

        const filterClients = allClient.map(client => ({
            ...client,
            cards: client.cards.length > 0 ? true : false,
            orders: client.orders.length > 0 ? true : false
        }))

        return okayRes(filterClients)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {

    try {

        //get clientID and request body
        const clientID = getSearchParams(req, 'clientID')
        const { name, password, organization, username, phone_number, email, address, gender, origin, note, departments, profile_key, profile_url }: FormData = await req.json()

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === CLIENT) {
            const client = await prisma.client.findUnique({ where: { id: session.user.id } })
            if (!client) return notFoundRes("Client")

            //if username changed check if the new username already exist in all users
            if (client.username !== username && username) {
                const existingUsername = await checkUsername(username)
                if (existingUsername) return existRes('Username')
            }

            //update the client
            const updatedClient = await prisma.client.update({
                where: {
                    id: client.id
                },
                data: {
                    name, username, password, organization, origin, phone_number, email, address, gender, note
                }
            })
            if (!updatedClient) return badRequestRes("Failed to update the client")
            //return 400 reponse if it fails to update the client

            //return 200 response
            return okayRes()
        }

        const isAdmin = await checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only allow admin to proceed

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
            if (!client) return notFoundRes('Client')

            if (client.username !== username && username) {

                const existingUsername = await checkUsername(username)
                if (existingUsername) return existRes("Username")

            }

            //update client
            const updatedClient = await prisma.client.update({
                where: { id: client.id },
                data: {
                    name, username, password, organization, origin, phone_number, email, address, gender, note, profile_key, profile_url
                }
            })
            if (!updatedClient) return badRequestRes()
            //return 400 respone if it fails

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
                //return 404 if some department not found
                if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 404 });

                const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));

                const departmentsToRemove = client.departments.filter((department) =>
                    !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
                );

                //update client departments
                const updatedClient = await prisma.client.update({
                    where: { id: client.id },
                    data: {
                        departments: {
                            connect: departmentsToConnect,
                            disconnect: departmentsToRemove,
                        },
                    }
                })
                if (!updatedClient) return badRequestRes("Failed to update client")
                //return 400 response if it fails to update the client
            }

            //return 200 response 
            return okayRes()
        }

        // 404 response if clientID not passed
        return notFoundRes(CLIENT)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


export const DELETE = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only allow admin to proceed
        const { searchParams } = new URL(req.url);
        const clientIDS = searchParams.getAll('clientID');
        //get all clientID

        if (clientIDS.length > 0) {

            const deleteClients = await prisma.client.deleteMany({
                where: { id: { in: clientIDS } },
            })
            if (!deleteClients) return badRequestRes("Failed to delete Client")
            //return 400 response if it fails to delete
            if (deleteClients.count < 1) return notFoundRes(CLIENT)

            //return 200 response
            return okayRes()
        }

        //return 404 response if clientID not passed
        return notFoundRes(CLIENT)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect();
    }
}