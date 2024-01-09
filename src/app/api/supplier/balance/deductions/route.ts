import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    try {

        const supplierID = getSearchParams(req, 'supplierID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'supplier') {

            const supplier = await prisma.supplier.findUnique({
                where: { id: session.user.id },
                include: {
                    balance: {
                        include: {
                            deductions: {
                                orderBy: { created_at: 'desc' }
                            }
                        }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.balance[0].deductions)

        }

        if (!supplierID) return notFoundRes("Supplier")
        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierID },
            include: {
                balance: {
                    include: {
                        deductions: {
                            orderBy: { created_at: 'desc' }
                        }
                    }
                }
            }
        })
        if (!supplier) return notFoundRes('Supplier')

        return okayRes(supplier.balance[0].deductions)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {

    try {

        const { name, quantity, supplierID, rate } = await req.json()

        if (!name) return notFoundRes('Name')
        if (!quantity) return notFoundRes('Quantity')
        if (!supplierID) return notFoundRes('Supplier')
        if (!rate) return notFoundRes('Rate')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (!['super-admin', 'admin'].includes(session.user.type)) return unauthorizedRes()

        const supplier = await prisma.supplier.findUnique({ where: { id: supplierID }, include: { balance: true } })
        if (!supplier) return notFoundRes('Supplier')

        const amount = Number(quantity) * Number(rate)

        const [updateSupplierBalance, createDeductions] = await Promise.all([
            prisma.supplierBalance.update({
                where: { id: supplier.balance[0].id }, data: {
                    amount: supplier.balance[0].amount - amount
                }
            }),
            prisma.supplierDeductions.create({
                data: {
                    name, quantity: Number(quantity), rate: Number(rate), amount,
                    balance: { connect: { id: supplier.balance[0].id } }
                }
            })
        ])

        if (!updateSupplierBalance || !createDeductions) return badRequestRes()

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}