import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, type, organization, user_name, password, phone_number, email, address, gender, origin,note, departments } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

        if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

        const newAgent = await prisma.agent.create({
            data: {
                departments, name, password, user_name, organization, phone_number, email, address, gender, origin,note
            }
        })

        if (!newAgent) return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: newAgent }, { status: 200 })

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

            const agentsDepartment = await prisma.agent.findMany({
                where: {
                    departments: {
                        array_contains: String(department)
                    }
                }
            })

            if (!agentsDepartment) return NextResponse.json({ succes: false, error: true, message: 'Server error' }, { status: 500 })

            if (agentsDepartment) return NextResponse.json({ success: true, data: agentsDepartment }, { status: 200 })


            return NextResponse.json({ success: true, data: agentsDepartment }, { status: 200 })
        }

        const agent = await prisma.agent.findUnique({ where: { id: String(id) } })

        if (agent) return NextResponse.json({ success: true, data: agent }, { status: 200 })

        if (id && !agent) return NextResponse.json({ success: false, error: true, message: 'No agent found' }, { status: 404 })

        const allClient = await prisma.agent.findMany()

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

        const agent = await prisma.agent.findUnique({ where: { id: String(id) } });

        if (!agent) { return NextResponse.json({ success: false, error: true, message: 'No agent found' }, { status: 404 }); }

        const deletedClient = await prisma.agent.delete({ where: { id: String(id) } });

        if (!deletedClient) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: deletedClient, message: 'Client deleted successfully' }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }
}

// export const PATCH = async (req: Request) => {

//     const { name, type, password, organization, user_name, phone_number, email, address, gender, origin, tags, note, departments } = await req.json()

//     const { searchParams } = new URL(req.url);

//     const id = searchParams.get('id');

//     try {

//         const agent = await prisma.agent.findUnique({ where: { id: String(id) } })

//         if (!agent) return NextResponse.json({ success: false, error: true, message: 'No agent found' }, { status: 404 })

//         const existingUsername =
//             await prisma.agent.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

//         if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

//         const existingEmail =
//             await prisma.agent.findUnique({ where: { email: String(email) } }) ||
//             await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
//             await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

//         if (existingEmail) return NextResponse.json({ success: false, data: { email: email }, message: 'Email already exist!' }, { status: 409 })

//         const updatedClient = await prisma.agent.update({
//             where: {
//                 id: String(id)
//             },
//             data: {
//                 name, user_name, password, organization, origin, tags, phone_number, email, address, gender, note, type, departments
//             }
//         })

//         if (!updatedClient) return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })

//         return NextResponse.json({ success: true, data: updatedClient, message: 'Client updated' })

//     } catch (error) {

//         console.log(error);

//     } finally {

//         prisma.$disconnect()

//     }
// }