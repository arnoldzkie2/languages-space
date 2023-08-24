import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = await req.json()

    try {

        const existingCard = await prisma.clientCard.findFirst({ where: { name } })

        if (existingCard) return NextResponse.json({ success: false, error: true, message: 'Card name already exist!' }, { status: 409 })

        const newCard = await prisma.clientCard.create({

            data: { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period }

        })

        if (!newCard) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: 0, data: newCard }, { status: 201 })

    } catch (error) {

        console.error(error);

        return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

    } finally {
        prisma.$disconnect()
    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (id) {

            const checkCard = await prisma.clientCard.findUnique({ where: { id }, include: { client: true } })

            if (!checkCard) return NextResponse.json({ success: false, error: true, message: 'No Card found' }, { status: 404 })

            return NextResponse.json({ success: true, errror: 0, data: checkCard }, { status: 200 })

        }

        const allCard = await prisma.clientCard.findMany({ include: { client: true } })

        if (!allCard) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: 0, data: allCard }, { status: 200 })

    } catch (error) {

        console.error(error);

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = await req.json()

    try {

        if (!id) return NextResponse.json({ success: false, error: true, message: 'No ID provided' }, { status: 404 })

        const checkCard = await prisma.clientCard.findUnique({ where: { id } })

        if (!checkCard) return NextResponse.json({ success: false, error: true, message: 'No Card found' }, { status: 404 })

        const checkCardName = await prisma.clientCard.findFirst({ where: { name } })

        if (checkCardName) return NextResponse.json({ success: false, error: true, message: 'Card Name Already exist' }, { status: 409 })

        const updateCard = await prisma.clientCard.update({
            where: { id }, data: {
                name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period
            }
        })

        if (!updateCard) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: 0, data: updateCard }, { status: 200 })

    } catch (error) {

        console.error(error);

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (!id) return NextResponse.json({ success: false, error: true, message: 'No ID provided' }, { status: 404 })

        const checkCard = await prisma.clientCard.findUnique({ where: { id } })

        if (!checkCard) return NextResponse.json({ success: false, error: true, message: 'No Card found' }, { status: 404 })

        const deleteCard = await prisma.clientCard.delete({ where: { id } })

        if (!deleteCard) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: 0, data: deleteCard }, { status: 200 })

    } catch (error) {

        console.error(error);

    }

}

