import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { user_name, password } = await req.json()

    try {

        const isSuperAdmin = await prisma.superAdmin.findUnique({
            where: {
                user_name,
                password
            }
        })

        if (isSuperAdmin) return NextResponse.json({ ...isSuperAdmin, type: 'super-admin' }, { status: 200 })

        const isAdmin = await prisma.admin.findUnique({
            where: {
                user_name,
                password
            }
        })

        if (isAdmin) return NextResponse.json({ ...isAdmin, type: 'admin' }, { status: 200 })

        const isAgent = await prisma.agent.findUnique({
            where: {
                user_name,
                password
            }
        })

        if (isAgent) return NextResponse.json({ ...isAgent, type: 'agent' }, { status: 200 })

        const isClient = await prisma.client.findUnique({
            where: {
                user_name,
                password
            }
        })

        if (isClient) return NextResponse.json({ ...isClient, type: 'client' }, { status: 200 })

        const isSupplier = await prisma.supplier.findUnique({
            where: {
                user_name,
                password
            }
        })

        if (isSupplier) return NextResponse.json({ ...isSupplier, type: 'supplier' }, { status: 200 })

        return NextResponse.json(null, { status: 404 })

    } catch (error) {

        console.log(error);

    }

}