import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name } = await req.json()

    try {

        const existingDepartment = await prisma.department.findFirst({
            where: { name }
        })

        if (existingDepartment) return NextResponse.json({ success: false, error: true, message: 'Department already exist!' }, { status: 200 })

        const newDepartment = await prisma.department.create({
            data: { name }
        })

        if (!newDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: newDepartment }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (id) {

            const checkId = await prisma.department.findFirst({
                where: { id: String(id) }
            })

            if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found!' }, { status: 404 })

            const singleDepartment = await prisma.department.findFirst({
                where: { id: String(id) }
            })

            if (!singleDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        }

        const allDepartment = await prisma.department.findMany()

        if (!allDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: allDepartment }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    const { name } = await req.json()

    const checkId = await prisma.department.findFirst({
        where: { id: String(id) }
    })

    if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found!' }, { status: 404 })

    const updatedDepartment = await prisma.department.update({
        where: { id: String(id) },
        data: { name }
    })

    if (!updatedDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

    return NextResponse.json({ success: true, data: updatedDepartment }, { status: 200 })

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    const checkId = await prisma.department.findFirst({
        where: { id: String(id) }
    })

    if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found!' }, { status: 404 })

    const deletedDepartment = await prisma.department.delete({
        where: { id: String(id) }
    })

    if (!deletedDepartment) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

    return NextResponse.json({ success: true, data: deletedDepartment }, { status: 200 })

}
