import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { user_name, password } = await req.json()

    try {

        const isSuperAdmin = await prisma.superAdmin.findFirst({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isSuperAdmin) return NextResponse.json({ success: true, data: isSuperAdmin, user: 'super-admin' }, { status: 200 })

        const isAdmin = await prisma.admin.findFirst({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isAdmin) return NextResponse.json({ success: true, data: isAdmin, user: 'admin' }, { status: 200 })

        const isAgent = await prisma.agent.findFirst({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isAgent) return NextResponse.json({ success: true, data: isAgent, user: 'agent' }, { status: 200 })

        const isClient = await prisma.client.findFirst({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isClient) return NextResponse.json({ success: true, data: isClient, user: 'client' }, { status: 200 })

        const isSupplier = await prisma.supplier.findFirst({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isSupplier) return NextResponse.json({ success: true, data: isSupplier, user: 'supplier' }, { status: 200 })

        return NextResponse.json({ success: false, error: true, message: 'Invalid credentials' }, { status: 20 })

    } catch (error) {

        console.log(error);

    }

}