import prisma from "@/lib/db";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";

export const POST = async (req: Request) => {

    const { clientID, cardID, quantity, operator, note, status, invoice_number, express_number, departmentID } = await req.json()

    try {

        const client = await prisma.client.findUnique({ where: { id: clientID }, include: { departments: true } })
        if (!client) return notFoundRes('Client')

        const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
        if (!card) return notFoundRes('Card')

        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        const newOrder = await prisma.order.create({
            data: {
                quantity, price: (quantity * Number(card.price)), operator, note, status, invoice_number, express_number,
                card: { connect: { id: card.id } },
                client: { connect: { id: client.id } },
                department: { connect: { id: department.id } }
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
    const clientID = searchParams.get('clientID')

    try {

        if (clientID) {
            const client = await prisma.client.findUnique({
                where: { id: clientID }, select: {
                    orders: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            status: true,
                            created_at: true,
                            card: {
                                select: {
                                    name: true
                                }
                            }

                        }
                    }
                }
            })
            if (!client) return notFoundRes('Client')

            return okayRes(client.orders)
        }

        if (orderID) {
            const order = await prisma.order.findUnique({
                where: {
                    id: orderID
                },
                include: { department: true, card: true, client: true }
            })
            if (!order) return notFoundRes('Order')

            return okayRes(order)
        }

        if (departmentID) {

            const departmentOrders = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    orders: {
                        include: {
                            card: true, client: true
                        }
                    }
                }
            })
            if (!departmentOrders) return badRequestRes()

            return okayRes(departmentOrders.orders)
        }

        const orders = await prisma.order.findMany({ include: { department: true, card: true, client: true } })
        if (!orders) return badRequestRes()

        return okayRes(orders)

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

    const { clientID, cardID, quantity, operator, note, status, invoice_number, express_number, departmentID } = await req.json()

    try {

        if (orderID) {
            const order = await prisma.order.findUnique({ where: { id: orderID } })
            if (!order) return notFoundRes('Order')

            const client = await prisma.client.findUnique({ where: { id: clientID } })
            if (!client) return notFoundRes('Client')

            const card = await prisma.clientCardList.findUnique({ where: { id: cardID } })
            if (!card) return notFoundRes('Client Card')

            const updatedOrder = await prisma.order.update({
                where: { id: orderID },
                data: {
                    clientID, cardID, quantity, price: (Number(card.price) * quantity),
                    operator, note, status, invoice_number, express_number, departmentID
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
    const orderIDS = searchParams.getAll('orderID');

    try {

        if (orderIDS.length > 0) {

            const deleteClients = await prisma.order.deleteMany({
                where: { id: { in: orderIDS } },
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