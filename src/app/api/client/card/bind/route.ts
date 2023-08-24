import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { client_id, card_id } = await req.json()

    try {

        const checkClient = await prisma.client.findUnique({ where: { id: client_id } })

        if (!checkClient) return NextResponse.json({ success: false, error: true, message: 'No Student found' }, { status: 404 })

        const checkCard = await prisma.clientCard.findUnique({ where: { id: card_id } })

        if (!checkCard) return NextResponse.json({ success: false, error: true, message: 'No Card found' }, { status: 404 })

        const bindCardToClient = await prisma.client.update({ where: { id: client_id }, include: { card: true }, data: { card: { connect: { id: card_id } } } })

        if (!bindCardToClient) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: 0, data: bindCardToClient })

    } catch (error) {

        console.error(error);

    }

}

export const PATCH = async (req: Request) => {

    const { client_id, card_id } = await req.json()

    try {

        const checkClient = await prisma.client.findUnique({ where: { id: client_id }, include: { card: true } })

        if (!checkClient) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        const updatedCard = checkClient.card.filter((c) => c.id !== card_id);

        const updateClient = await prisma.client.update({ where: { id: client_id }, data: { card: { set: updatedCard } }, include: { card: true } })

        if (!updateClient) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, error: 0, data: updateClient }, { status: 200 })

    } catch (error) {

        console.error(error);

    }
}