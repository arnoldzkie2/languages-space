import prisma from "@/lib/db";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')
    const clientCardID = searchParams.get('clientCardID')

    try {

        if (!supplierID) return notFoundRes('supplierID')
        if (!clientCardID) return notFoundRes('clientCardID')

        const card = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
        if (!card) return notFoundRes('Client Card')

        const price = await prisma.supplierPrice.findFirst({ where: { clientCardID: card.cardID, supplierID } })
        if (!price) return badRequestRes('supplier_not_supported')

        return okayRes(price.price)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}