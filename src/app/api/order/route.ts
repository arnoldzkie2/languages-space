import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, client_name, card, quantity, price, operator, note, status, invoice_number, express_number, departments } = await req.json()

    try {

        const newOrder = await prisma.order.create({
            data: {
                card: card,
                name: name,
                client_name: client_name,
                quantity: quantity,
                price: price,
                operator: operator,
                note: note,
                status: status,
                invoice_number: invoice_number,
                express_number: express_number,
                departments: departments
            }
        })

        if (!newOrder) {
            throw new Error('Server error')
        }

    } catch (error) {
        console.log(error);

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (id) {

            const checkId = await prisma.order.findUnique({
                where: {
                    id: String(id)
                }
            })

            if (!checkId) return NextResponse.json({ success: false, message: 'No id found' }, { status: 404 })

            const singleOrder = await prisma.order.findMany({
                where: {
                    id: String(id)
                }
            })

            if (!singleOrder) return NextResponse.json({ succes: false, error: true, message: 'Server error' }, { status: 500 })

            return NextResponse.json({ success: true, data: singleOrder }, { status: 200 })
        }

        const getAllOrder = await prisma.order.findMany()

        if (!getAllOrder) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: getAllOrder }, { status: 200 })

    } catch (error) {
        console.log(error);
    }

}
