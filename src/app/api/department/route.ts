import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, profile, user_name, password, type, organization, payment_information, phone_number, email, address, gender, card, origin, tags, note, employment_status, entry, departure } = await req.json()

    try {

        const checkUsername = await prisma.supplier.findFirst({
            where: { user_name }
        })

        if (checkUsername) return NextResponse.json({ success: false, error: true, message: 'Username already exist!' }, { status: 200 })

        const checkEmail = await prisma.supplier.findFirst({
            where: { email }
        })

        if (checkEmail) return NextResponse.json({ success: false, error: true, message: 'Email already exist!' }, { status: 200 })

        const newSupplier = await prisma.supplier.create({
            data: { name, profile, user_name, type, password, organization, payment_information, phone_number, email, address, gender, card, origin, tags, note, employment_status, entry, departure }
        })

        if (!newSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: newSupplier }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (id) {

            const checkId = await prisma.supplier.findFirst({
                where: { id }
            })

            if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id fount' }, { status: 404 })

            const singleSupplier = await prisma.supplier.findMany({
                where: { id }
            })

            if (!singleSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

            return NextResponse.json({ success: true, data: singleSupplier }, { status: 200 })

        }

        const allSupplier = await prisma.supplier.findMany()

        if (!allSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 200 })

        return NextResponse.json({ success: true, data: allSupplier }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}

export const PATCH = async (req: Request) => {

    const { name, profile, user_name, password, type, organization, payment_information, phone_number, email, address, gender, card, origin, tags, note, employment_status, entry, departure } = await req.json()

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const checkId = await prisma.supplier.findFirst({
            where: { id: String(id) }
        })

        if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found' }, { status: 404 })

        const updatedSupplier = await prisma.supplier.update({
            where: { id: String(id) }, data: { name, profile, user_name, password, type, organization, payment_information, phone_number, email, address, gender, card, origin, tags, note, employment_status, entry, departure }
        })

        if (!updatedSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: updatedSupplier }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const deletedSupplier = await prisma.supplier.delete({
            where: { id: String(id) }
        })

        if (!deletedSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: deletedSupplier, message: 'Deleted this supplier' }, { status: 200 })


    } catch (error) {

        console.log(error);

    }
}

