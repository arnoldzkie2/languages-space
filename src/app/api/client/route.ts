import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { profile, name, organization, user_name, password, phone_number, email, address, gender, origin, note, departments } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name } }) ||
            await prisma.admin.findUnique({ where: { user_name } }) ||
            await prisma.supplier.findUnique({ where: { user_name } }) ||
            await prisma.agent.findUnique({ where: { user_name } })

        if (existingUsername) return NextResponse.json({ message: 'Username already exist!' }, { status: 409 })

        const newUser = await prisma.client.create({
            data: {
                profile, name, password, user_name, organization, phone_number, email, address, gender, origin, note, departments: {
                    connect: departments.map((id: string) => ({ id }))
                }
            }
        })

        if (!newUser) return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: newUser }, { status: 200 })

    } catch (error) {
        console.log(error);
    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const clientID = searchParams.get('clientID')

    const departmentID = searchParams.get('departmentID')

    try {

        if (clientID) {

            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } });

            if (!client) return NextResponse.json({ message: 'Client Not Found' }, { status: 404 })

            return NextResponse.json({ data: client })

        }

        if (departmentID) {

            const checkDepartment = await prisma.department.findUnique({ where: { id: departmentID } })

            if (!checkDepartment) return NextResponse.json({ message: 'No Department Found' }, { status: 404 })

            const clientsDepartment = await prisma.department.findUnique({
                where: {
                    id: departmentID
                },
                include: {
                    clients: {
                        include: {
                            departments: true
                        }
                    }
                }
            })

            if (!clientsDepartment) return NextResponse.json({ message: 'Server Error' }, { status: 500 })

            return NextResponse.json({ data: clientsDepartment.clients }, { status: 200 })

        }

        const allClient = await prisma.client.findMany({ include: { departments: true } })

        if (!allClient) return NextResponse.json({ message: 'Server error' }, { status: 500 })

        return NextResponse.json({ data: allClient })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    try {

        const client = await prisma.client.findUnique({ where: { id: String(id) } });

        if (!client) { return NextResponse.json({ success: false, error: true, message: 'No client found' }, { status: 404 }); }

        const deletedClient = await prisma.client.delete({ where: { id: String(id) } });

        if (!deletedClient) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: deletedClient, message: 'Client deleted successfully' }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }
}

export const PATCH = async (req: Request) => {

    const { profile, name, password, organization, user_name, phone_number, email, address, gender, origin, tags, note, departments } = await req.json()

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    try {

        const client = await prisma.client.findUnique({ where: { id: String(id) } })

        if (!client) return NextResponse.json({ success: false, error: true, message: 'No client found' }, { status: 404 })

        if (client.user_name !== user_name) {

            const existingUsername =
                await prisma.client.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
                await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

            if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

        }

        if (departments && Array.isArray(departments)) {
            const nonExistentDepartments = await Promise.all(
                departments.map(async (departmentId) => {
                    const checkDepartment = await prisma.department.findUnique({
                        where: {
                            id: departmentId,
                        },
                    });
                    return { id: departmentId, exists: Boolean(checkDepartment) };
                })
            );

            const nonExistentDepartmentsList = nonExistentDepartments.filter(
                (department) => !department.exists
            );

            if (nonExistentDepartmentsList.length > 0) {
                const nonExistentDepartmentIds = nonExistentDepartmentsList.map(
                    (department) => department.id
                );
                return NextResponse.json({
                    success: false,
                    error: true,
                    message: `Departments with IDs [${nonExistentDepartmentIds.join(
                        ', '
                    )}] do not exist`,
                }, { status: 404 });
            }
        }

        const updatedClient = await prisma.client.update({
            where: {
                id: String(id)
            },
            data: {
                profile, name, user_name, password, organization, origin, phone_number, email, address, gender, note, departments
            }
        })

        if (!updatedClient) return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: updatedClient, message: 'Client updated' })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }
}