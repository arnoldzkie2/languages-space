import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const POST = async (req: Request) => {

    const { client_id, card_id, quantity, operator, note, status, invoice_number, express_number } = await req.json()

    try {

        const client = await prisma.client.findUnique({ where: { id: client_id }, include: { departments: true } })
        if (!client) return notFoundRes('Client')

        const card = await prisma.clientCardList.findUnique({ where: { id: card_id } })
        if (!card) return notFoundRes('Card')

        const newOrder = await prisma.order.create({
            data: {
                quantity, price: quantity * card.price, operator, note, status, invoice_number, express_number,
                card: { connect: { id: card_id } },
                client: { connect: { id: client_id } },
                departments: { connect: client.departments.map((dept) => ({ id: dept.id })) }
            }
        })
        if (!newOrder) badRequestRes()

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const orderID = searchParams.get('orderID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (orderID) {
            const order = await prisma.order.findUnique({
                where: {
                    id: orderID
                },
                include: { departments: true, card: true, client: true }
            })
            if (!order) return notFoundRes('Order')

            return okayRes(order)
        }

        if (departmentID) {

            const allOrder = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    orders: {
                        select: { departments: true }
                    }
                }
            })
            if (!allOrder) return badRequestRes()

            return okayRes(allOrder.orders)
        }

        const getAllOrder = await prisma.order.findMany({ include: { departments: true, card: true, client: true } })
        if (!getAllOrder) return badRequestRes()

        return okayRes(getAllOrder)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const orderID = searchParams.get('orderID')

    const { clientID, cardID, quantity, operator, note, status, invoice_number, express_number } = await req.json()

    try {

        if (orderID) {
            const order = await prisma.order.findUnique({ where: { id: orderID }, include: { departments: true, card: true, client: true } })
            if (!order) return notFoundRes('Order')

            const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
            if (!client) return notFoundRes('Client')

            const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
            if(!card) return notFoundRes('Client Card')

            const updatedOrder = await prisma.order.update({
                where: { id: orderID },
                data: {
                    clientID, cardID, quantity, price: quantity * order.card.price,
                    operator, note, status, invoice_number, express_number
                }
            })
            if (!updatedOrder) return badRequestRes()

            return okayRes()
        }

        return notFoundRes('orderID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll('orderID');

    try {

        if (ids.length > 0) {

            const deleteClients = await prisma.order.deleteMany({
                where: { id: { in: ids } },
            })
            if (!deleteClients) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('orderID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect();
    }
}