import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { SUPPLIER } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const supplierID = getSearchParams(req, 'supplierID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === SUPPLIER) {
            const supplier = await prisma.supplier.findUnique({ where: { id: session.user.id }, include: { balance: true } })
            if (!supplier) return unauthorizedRes()

            return okayRes(supplier.balance[0])
        }

        if (supplierID) {

            if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.balance[0])
        }

        return notFoundRes('Supplier')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
