import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { name } = await req.json()

    try {

        const existingDepartment = await prisma.department.findFirst({ where: { name } })

        if (existingDepartment) return NextResponse.json({ success: false, error: true, message: 'Department already exist!' }, { status: 200 })

        const newDepartment = await prisma.department.create({ data: { name } })

        if (!newDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: newDepartment, message: 'Created a new department' }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')?.toString()

    try {

        const singleDepartment = await prisma.department.findUnique({ where: { id: String(id) } })

        if (singleDepartment) return NextResponse.json({ success: true, data: singleDepartment }, { status: 200 })

        if (id && !singleDepartment) return NextResponse.json({ success: false, error: true, message: 'No department found' }, { status: 404 })

        const allDepartment = await prisma.department.findMany()

        if (!allDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: allDepartment }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')?.toString()

    const { name } = await req.json()

    try {

        const checkDepartment = await prisma.department.findFirst({ where: { name } })

        if (checkDepartment) return NextResponse.json({ success: false, error: true, message: 'Department already exist' }, { status: 409 })

        const singleDepartment = await prisma.department.findUnique({ where: { id } })

        if (!singleDepartment) return NextResponse.json({ success: false, error: true, message: 'No department found' }, { status: 404 })

        const updatedDepartment = await prisma.department.update({ where: { id }, data: { name } })

        if (!updatedDepartment) return NextResponse.json({ success: false, error: true, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: updatedDepartment, message: 'Department udpated successfully' }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')?.toString()

    try {

        const checkDepartment = await prisma.department.findFirst({ where: { id } })

        if (!checkDepartment) return NextResponse.json({ success: false, error: true, message: 'No department found' }, { status: 404 })

        const deletedDepartment = await prisma.department.delete({ where: { id } })

        if (!deletedDepartment) return NextResponse.json({ success: false, error: true, message: 'Bad request' }, { status: 400 })

        return NextResponse.json({ success: true, data: deletedDepartment }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}