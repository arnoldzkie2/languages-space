import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";

export const POST = async (req: Request) => {

    const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = await req.json()

    try {

        const existingCard = await prisma.clientCardList.findFirst({
            where: { name }
        })

        if (existingCard) return existRes('client_card_name')

        const newCard = await prisma.clientCardList.create({

            data: { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period }

        })

        if (!newCard) return badRequestRes()

        return createdRes()

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {
        prisma.$disconnect()
    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const clientCardID = searchParams.get('clientCardID')

    try {

        if (clientCardID) {

            const checkCard = await prisma.clientCard.findUnique({
                where: { id: clientCardID }
            })

            if (!checkCard) return notFoundRes('Card')

            return okayRes(checkCard)

        }

        const allCard = await prisma.clientCardList.findMany()

        if (!allCard) return badRequestRes()

        return okayRes(allCard)

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const clientCardID = searchParams.get('clientCardID')

    const { name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period } = await req.json()

    try {

        if (clientCardID) {

            const checkCard = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })

            if (!checkCard) return notFoundRes('Client Card')

            if (checkCard.name === name) {

                const updateCard = await prisma.clientCardList.update({
                    where: { id: clientCardID },
                    data: {
                        price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period
                    }
                })

                if (!updateCard) return badRequestRes()

                return okayRes()

            }

            const checkCardName = await prisma.clientCardList.findFirst({ where: { name } })

            if (checkCardName) return existRes('client_card_name')

            const updateCard = await prisma.clientCardList.update({
                where: { id: clientCardID },
                data: {
                    name, price, balance, validity, invoice, repeat_purchases, online_purchases, online_renews, settlement_period
                }
            })

            if (!updateCard) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('clientCardID')

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const clientCardID = searchParams.get('clientCardID')

    try {

        if (clientCardID) {

            const checkCard = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })

            if (!checkCard) return notFoundRes('Client Card')

            const deleteCard = await prisma.clientCardList.delete({ where: { id: clientCardID } })

            if (!deleteCard) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('clientCardID')

    } catch (error) {

        console.error(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}

