import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { serverErrorRes } from "@/utils/apiResponse";

export const POST = async (req: Request) => {

    const { username, password } = await req.json()

    try {

        const [client, supplier, agent, admin, superAdmin] = await Promise.all([
            prisma.client.findUnique({
                where: { username, password }
            }),
            prisma.supplier.findUnique({
                where: { username, password }
            }),
            prisma.agent.findUnique({
                where: { username, password }
            }),
            prisma.admin.findUnique({
                where: { username, password }
            }),
            prisma.superAdmin.findUnique({
                where: { username, password }
            }),
        ]);

        if (client) return NextResponse.json({ ...client, type: 'client' }, { status: 200 })
        if (supplier) return NextResponse.json({ ...supplier, type: 'supplier' }, { status: 200 })
        if (admin) return NextResponse.json({ ...admin, type: 'admin' }, { status: 200 })
        if (agent) return NextResponse.json({ ...agent, type: 'agent' }, { status: 200 })
        if (superAdmin) return NextResponse.json({ ...superAdmin, type: 'super-admin' }, { status: 200 })

        return NextResponse.json(null, { status: 404 })

    } catch (error) {

        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}