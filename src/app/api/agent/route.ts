import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, organization, username, password, phone_number, email, address, gender, origin, note, departments } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { username: String(username) } }) ||
            await prisma.superAdmin.findUnique({ where: { username: String(username) } }) ||
            await prisma.admin.findUnique({ where: { username: String(username) } }) ||
            await prisma.supplier.findUnique({ where: { username: String(username) } }) ||
            await prisma.agent.findUnique({ where: { username: String(username) } })

        if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

        const newAgent = await prisma.agent.create({
            data: {
                departments: { connect: departments.map((id: string) => { id }) }, name, password, username, organization, phone_number, email, address, gender, origin, note
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

    const departmentID = searchParams.get('departmentID')

    try {

        if (departmentID) {

            const agentsDepartment = await prisma.department.findUnique({
                where: {
                    id: departmentID
                }, include: { agents: true }
            })

            if (!agentsDepartment) return NextResponse.json({ message: 'Server error' }, { status: 500 })

            return NextResponse.json({ data: agentsDepartment.agents }, { status: 200 })
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

//     const { name, type, password, organization, username, phone_number, email, address, gender, origin, tags, note, departments } = await req.json()

//     const { searchParams } = new URL(req.url);

//     const id = searchParams.get('id');

//     try {

//         const agent = await prisma.agent.findUnique({ where: { id: String(id) } })

//         if (!agent) return NextResponse.json({ success: false, error: true, message: 'No agent found' }, { status: 404 })

//         const existingUsername =
//             await prisma.agent.findUnique({ where: { username: String(username) } }) ||
//             await prisma.superAdmin.findUnique({ where: { username: String(username) } }) ||
//             await prisma.admin.findUnique({ where: { username: String(username) } }) ||
//             await prisma.supplier.findUnique({ where: { username: String(username) } }) ||
//             await prisma.agent.findUnique({ where: { username: String(username) } })

//         if (existingUsername) return NextResponse.json({ success: false, data: { email: email }, message: 'Username already exist!' }, { status: 409 })

//         const existingEmail =
//             await prisma.agent.findUnique({ where: { email: String(email) } }) ||
//             await prisma.superAdmin.findUnique({ where: { username: String(username) } }) ||
//             await prisma.admin.findUnique({ where: { username: String(username) } }) ||
//             await prisma.supplier.findUnique({ where: { username: String(username) } }) ||
//             await prisma.agent.findUnique({ where: { username: String(username) } })

//         if (existingEmail) return NextResponse.json({ success: false, data: { email: email }, message: 'Email already exist!' }, { status: 409 })

//         const updatedClient = await prisma.agent.update({
//             where: {
//                 id: String(id)
//             },
//             data: {
//                 name, username, password, organization, origin, tags, phone_number, email, address, gender, note, type, departments
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