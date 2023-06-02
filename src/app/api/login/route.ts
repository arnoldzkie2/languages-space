import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export const POST = async (req: Request) => {

    const { user_name, password } = await req.json()

    try {

        const isSuperAdmin = await prisma.superAdmin.findMany({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isSuperAdmin) return NextResponse.json({ success: true, data: isSuperAdmin, user: 'super-admin' }, { status: 200 })

        const isAdmin = await prisma.admin.findMany({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isAdmin) return NextResponse.json({ success: true, data: isSuperAdmin, user: 'admin' }, { status: 200 })

        const isAgent = await prisma.agent.findMany({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isAgent) return NextResponse.json({ success: true, data: isSuperAdmin, user: 'agent' }, { status: 200 })

        const isClient = await prisma.client.findMany({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isClient) return NextResponse.json({ success: true, data: isSuperAdmin, user: 'client' }, { status: 200 })

        const isSupplier = await prisma.supplier.findMany({
            where: {
                user_name: user_name,
                password: password
            }
        })

        if (isSupplier) return NextResponse.json({ success: true, data: isSuperAdmin, user: 'supplier' }, { status: 200 })

        return NextResponse.json({ success: false, error: true, message: 'Invalid credentials' }, { status: 20 })

    } catch (error) {

        console.log(error);

    }

}