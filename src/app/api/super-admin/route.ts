import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

    const { user_name, password } = await req.json()

    try {

        const checkUsername = await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } })

        if (checkUsername) return NextResponse.json({ success: false, error: true, message: 'Username already exist!' }, { status: 409 })

        const newSuperAdmin = await prisma.superAdmin.create({ data: { user_name, password } })

        if (!newSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: newSuperAdmin }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const singleSuperAdmin = await prisma.superAdmin.findUnique({ where: { id: String(id) } })

        if (singleSuperAdmin) return NextResponse.json({ success: true, data: singleSuperAdmin }, { status: 200 })

        if (id && !singleSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'No super admin found' }, { status: 404 })

        const allSuperAdmin = await prisma.superAdmin.findMany()

        if (!allSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: allSuperAdmin }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }
}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    const { user_name, password } = await req.json()

    try {

        const superAdmin = await prisma.superAdmin.findUnique({ where: { id: String(id) } })

        if (!superAdmin) return NextResponse.json({ success: false, error: true, message: 'No Super admin found' }, { status: 404 })

        const checkUsername = await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } })

        if (checkUsername) return NextResponse.json({ succes: false, error: true, message: 'Username already exist!' }, { status: 409 })

        const updatedSuperAdmin = await prisma.superAdmin.update({
            where: { id: String(id) },
            data: { user_name, password }
        })

        if (!updatedSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: updatedSuperAdmin, message: 'Updated superadmin' }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const superAdmin = await prisma.superAdmin.findUnique({ where: { id: String(id) } })

        if (!superAdmin) return NextResponse.json({ succes: false, error: true, message: 'No super admin found' }, { status: 404 })

        const deletedSuperAdmin = await prisma.superAdmin.delete({ where: { id: String(id) } })

        if (!deletedSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: deletedSuperAdmin, message: 'Deleted super admin' }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()


    }

}