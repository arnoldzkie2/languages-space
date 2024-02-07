import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { Commissions } from "@/lib/state/super-admin/supplierCommissionStore";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { FINGERPOWER, SUPPLIER } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allowe admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const supplierID = getSearchParams(req, 'supplierID')
        if (!supplierID) return notFoundRes(SUPPLIER)
        //return 404 response if not found

        //retrieve supplier and their commissions
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierID },
            select: {
                id: true,
                commission: {
                    select: {
                        booking_rate: true,
                        id: true,
                        cardID: true,
                        card: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!supplier) return notFoundRes(SUPPLIER)
        //return 404 response if supplier not found

        const cards = await prisma.clientCardList.findMany({
            select: { id: true },
            where: { departments: { name: FINGERPOWER } }
        })

        if (supplier.commission.length !== cards.length) {
            const existingCardIDs = supplier.commission.map(commission => commission.cardID);
            const missingCardIDs = cards.filter(card => !existingCardIDs.includes(card.id));

            // Use Promise.all to create commissions in parallel
            await Promise.all(missingCardIDs.map(async (card) => {
                await prisma.supplierCommission.create({
                    data: {
                        booking_rate: 0, // Set initial booking rate as needed
                        card: { connect: { id: card.id } },
                        supplier: { connect: { id: supplier.id } }
                    },
                });
            }));

            // Update the supplier variable with the updated commissions
            const supplierCommission = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: {
                    id: true,
                    commission: {
                        select: {
                            booking_rate: true,
                            id: true,
                            cardID: true,
                            card: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
            if (!supplierCommission) return badRequestRes("Failed to get supplier")

            //return 200 resposne
            return okayRes(supplierCommission.commission)
        }

        //return 200 response and pass supplier commissions
        return okayRes(supplier.commission)
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allowe admin
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const supplierID = getSearchParams(req, 'supplierID')
        if (!supplierID) return notFoundRes(SUPPLIER)
        //return 404 response if not found

        const body: { booking_rate: number; cardID: string }[] = await req.json();

        let existingCommissions = await prisma.supplier.findUnique({
            where: { id: supplierID },
            select: { commission: true },
        });

        if (!existingCommissions) return notFoundRes(SUPPLIER);

        const updatedCommissions = existingCommissions.commission.map((commission) => {
            const matchingData = body.find((data) => data.cardID === commission.cardID);

            if (matchingData) {
                return {
                    ...commission,
                    booking_rate: matchingData.booking_rate,
                };
            }

            return commission;
        });

        const updatedSupplier = await prisma.supplier.update({
            where: { id: supplierID },
            data: {
                commission: {
                    updateMany: updatedCommissions.map((commission) => ({
                        where: { id: commission.id },
                        data: { booking_rate: commission.booking_rate },
                    })),
                },
            },
            select: { commission: true },
        });
        if (!updatedSupplier) return badRequestRes("Failed to update commissions")

        return okayRes()
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}