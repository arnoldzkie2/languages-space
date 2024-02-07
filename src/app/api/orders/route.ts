import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";

export const GET = async (req: Request) => {

    const session = await getAuth()
    if (!session) return unauthorizedRes()
    //only allow admin to proceed
    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

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
                            name: true
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
                include: { departments: true, client: true }
            })
            if (!order) return notFoundRes('Order')

            return okayRes(order)
        }

        if (departmentID) {

            const departmentOrders = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    orders: {
                        include: {
                            client: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            })
            if (!departmentOrders) return badRequestRes()

            return okayRes(departmentOrders.orders)
        }

        const orders = await prisma.order.findMany({
            include: {
                client: {
                    select: {
                        username: true
                    }
                }
            }
        })
        if (!orders) return badRequestRes()

        return okayRes(orders)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}


export const POST = async (req: Request) => {

    const session = await getAuth()
    if (!session) return unauthorizedRes()
    //only allow admin to proceed
    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

    const { clientID, cardID, quantity, operator, note, status, invoice_number, express_number, price } = await req.json()

    try {

        //retrieve client and card 
        const [client, card] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.clientCardList.findUnique({ where: { id: cardID } }),
        ])

        //return 404 if one of them not exist
        if (!client) return notFoundRes('Client')
        if (!card) return notFoundRes('Card')

        //check department
        const department = await prisma.department.findUnique({ where: { id: card.departmentID } })
        if (!department) return notFoundRes("Card doesn't have department")

        //create order and bind it to client and department
        const newOrder = await prisma.order.create({
            data: {
                quantity, price, operator, note, status, invoice_number, express_number,
                name: card.name,
                cardID: card.id,
                client: { connect: { id: client.id } },
                departments: { connect: { id: department.id } }
            }
        })
        if (!newOrder) badRequestRes("Failed to create order")
        //return 400 response if it fails

        //return 201 response
        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const PATCH = async (req: Request) => {

    const session = await getAuth()
    if (!session) return unauthorizedRes()
    //only allow admin to proceed
    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

    const { searchParams } = new URL(req.url)
    const orderID = searchParams.get('orderID')

    const { clientID, cardID, quantity, note, status, invoice_number, express_number, price } = await req.json()

    try {

        if (!orderID) return notFoundRes("Order")

        //retrieve order - client - card
        const [order, client, card] = await Promise.all([
            prisma.order.findUnique({ where: { id: orderID } }),
            prisma.client.findUnique({ where: { id: clientID } }),
            prisma.clientCardList.findUnique({ where: { id: cardID } })
        ])
        if (!order) return notFoundRes('Order')
        if (!client) return notFoundRes("Client")
        if (!card) return notFoundRes("Card")

        //update the order
        const updatedOrder = await prisma.order.update({
            where: { id: orderID },
            data: {
                clientID, cardID, name: card.name, quantity, price,
                note, status, invoice_number, express_number, departmentID: card.departmentID
            }
        })
        if (!updatedOrder) return badRequestRes("Failed to create order")
        //return 400 response if it fails

        //return 200 response
        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const session = await getAuth()
    if (!session) return unauthorizedRes()
    //only allow admin to proceed
    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

    const { searchParams } = new URL(req.url);
    const orderIDS = searchParams.getAll('orderID');

    try {

        if (orderIDS.length > 0) {

            const deleteOrders = await prisma.order.deleteMany({
                where: { id: { in: orderIDS } },
            })
            if (!deleteOrders) return badRequestRes()

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