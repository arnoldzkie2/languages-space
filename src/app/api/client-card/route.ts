import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = await req.json()

    if (!name || !price || !balance || !validity || !invoice || !repeat_purchases || !online_purchases || !online_renews || !settlement_period) {

        return NextResponse.json({ success: false, error: true, message: 'Form is incomplete' }, { status: 400 })

    }

    try {

        const existingCard = await prisma.clientCard.findUnique({ where: name })

        if (existingCard) return NextResponse.json({ success: false, error: true, message: 'Card name already exist!' }, { status: 409 })

        const newCard = await prisma.clientCard.create({

            data: { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period }
        
        })

        if (!newCard) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: newCard }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {
        prisma.$disconnect()
    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

}

