import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, type, organization, user_name, password, phone_number, email, address, gender, origin, tags, departments } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

        if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

        const existingEmail =
            await prisma.client.findUnique({ where: { email: String(email) } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

        if (existingEmail) return NextResponse.json({ success: false, data: { email: email }, message: 'Email already exist!' }, { status: 409 })

        const newUser = await prisma.client.create({
            data: {
                departments, name, password, user_name, type, organization, phone_number, email, address, gender, origin, tags,
            }
        })

        if (!newUser) return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: newUser }, { status: 200 })

    } catch (error) {
        console.log(error);
    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id')

    const department = searchParams.get('department')

    try {

        if (department) {

            const clientsDepartment = await prisma.client.findMany({
                where: {
                    departments: {
                        array_contains: String(department)
                    }
                }
            })

            if (clientsDepartment.length === 0) return NextResponse.json({ success: false, error: true, message: 'No department found' }, { status: 404 })
            
            if (clientsDepartment) return NextResponse.json({ success: true, data: clientsDepartment }, { status: 200 })

        }

        const client = await prisma.client.findUnique({ where: { id: String(id) } })

        if (client) return NextResponse.json({ success: true, data: client }, { status: 200 })

        if (id && !client) return NextResponse.json({ success: false, error: true, message: 'No client found' }, { status: 404 })

        const allClient = await prisma.client.findMany()

        if (!allClient) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: allClient }, { status: 200 })

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

    const { name, type, password, organization, user_name, phone_number, email, address, gender, origin, tags, note, departments } = await req.json()

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    try {

        const client = await prisma.client.findUnique({ where: { id: String(id) } })

        if (!client) return NextResponse.json({ success: false, error: true, message: 'No client found' }, { status: 404 })

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

        if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

        const existingEmail =
            await prisma.client.findUnique({ where: { email: String(email) } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

        if (existingEmail) return NextResponse.json({ success: false, data: { email: email }, message: 'Email already exist!' }, { status: 409 })

        const updatedClient = await prisma.client.update({
            where: {
                id: String(id)
            },
            data: {
                name, user_name, password, organization, origin, tags, phone_number, email, address, gender, note, type, departments
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