import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

    const { user_name, name, email, password } = await req.json()

    try {

        const checkUsername = await prisma.superAdmin.findFirst({
            where: { user_name }
        })

        if (checkUsername) return NextResponse.json({ success: false, error: true, message: 'Username already exist!' }, { status: 200 })

        const checkEmail = await prisma.superAdmin.findFirst({
            where: { email }
        })

        if (checkEmail) return NextResponse.json({ success: false, error: true, message: 'Email already exist!' }, { status: 200 })

        const newSuperAdmin = await prisma.superAdmin.create({
            data: { name, user_name, email, password }
        })

        if (!newSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: newSuperAdmin }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const GET = async (req: Request) => {

    try {

        const allSuperAdmin = await prisma.superAdmin.findMany()

        if (!allSuperAdmin) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: allSuperAdmin }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}