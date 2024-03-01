import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import stripe from "@/utils/getStripe";
import { NextRequest } from "next/server";
export const POST = async (req: NextRequest) => {

    try {
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { name, price, balance, validity, invoice, repeat_purchases, available, online_renews, courses, suppliers, departmentID } = await req.json()

        //check if department exist
        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        //create a new card if the card doesn't exist in database
        const newCard = await prisma.clientCardList.create({
            data: {
                name, price: Number(price).toFixed(2), balance, validity, invoice, repeat_purchases, available,
                online_renews, productID: '', productPriceID: '', sold: 0,
                supported_courses: {
                    connect: courses.map((id: string) => ({ id }))
                }, departments: { connect: { id: departmentID } }
            },
            include: { supported_courses: true, supported_suppliers: true }
        })
        if (!newCard) return badRequestRes()

        const connectSuppliers = await prisma.clientCardList.update({
            where: {
                id: newCard.id
            }, data: {
                supported_suppliers: {
                    create: suppliers.map((supplierPrice: any) => ({
                        supplier: {
                            connect: { id: supplierPrice.supplierID }
                        },
                        price: supplierPrice.price
                    }))
                }
            }
        })
        if (!connectSuppliers) return badRequestRes()

        //create a new product in stripe and the value is the newCard
        const createCardProduct = await stripe.products.create({
            name: newCard.name,
            type: 'service',
            description: `
            Validity: ${validity} ${validity > 1 ? 'Days' : 'Day'},
            Balance: ${balance}
            `
        })
        if (!createCardProduct) {
            await prisma.clientCardList.delete({ where: { id: newCard.id } })
            return badRequestRes()
        }

        // add a price to the created card product
        const updateCardPrice = await stripe.prices.create({
            product: createCardProduct.id,
            unit_amount: Number(newCard.price) * 100,
            currency: 'cny',
        });
        if (!updateCardPrice) {
            await prisma.clientCardList.delete({ where: { id: newCard.id } })
            await stripe.products.del(createCardProduct.id)
            return badRequestRes()
        }

        //update the card description in stripe
        const updateCardDescription = await stripe.products.update(createCardProduct.id, {
            description: `Balance: ${newCard.balance}, Validity: ${newCard.validity} Days`
        })

        if (!updateCardDescription) {
            await prisma.clientCardList.delete({ where: { id: newCard.id } })
            await stripe.products.del(createCardProduct.id)
            return badRequestRes()
        }

        //update the new createdcard.product object into product_Id and price_id so we can update and delete it 
        const updateProductID = await prisma.clientCardList.update({
            where: { id: newCard.id }, data: {
                productID: createCardProduct.id,
                productPriceID: updateCardPrice.id
            },
            include: { supported_courses: true, supported_suppliers: true }
        })
        if (!updateProductID) return badRequestRes()

        //send a okay response
        return createdRes(updateProductID)

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}

export const GET = async (req: NextRequest) => {

    const cardID = getSearchParams(req, 'cardID')
    const departmentID = getSearchParams(req, 'departmentID')

    const session = await getAuth()
    if (!session) return unauthorizedRes()
    //only allow admin to proceed
    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

    try {

        if (departmentID) {

            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    cards: {
                        include: {
                            active: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            })
            if (!department) return notFoundRes('Department')

            return okayRes(department.cards)
        }

        if (cardID) {

            const card = await prisma.clientCardList.findUnique({
                where: { id: cardID },
                include: {
                    departments: true,
                    supported_courses: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    supported_suppliers: {
                        select: {
                            price: true,
                            supplierID: true,
                            supplier: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }

            })
            if (!card) return notFoundRes('Card')

            return okayRes(card)
        }

        const allCard = await prisma.clientCardList.findMany({
            include: {
                active: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (!allCard) return badRequestRes()

        return okayRes(allCard)

    } catch (error) {
        console.error(error)
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: NextRequest) => {

    const clientCardID = getSearchParams(req, 'clientCardID')

    const { name, price, balance, validity, invoice, repeat_purchases, available, departmentID,
        online_renews, courses, suppliers } = await req.json()

    const session = await getAuth()
    if (!session) return unauthorizedRes()
    //only allow admin to proceed
    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

    try {

        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        if (!clientCardID) return notFoundRes("Card")

        //retrieve the card
        const card = await prisma.clientCardList.findUnique({ where: { id: clientCardID }, include: { supported_courses: true } })
        if (!card) return notFoundRes('Client Card')

        if (card.name !== name) {

            const checkExistingCard = await prisma.clientCardList.findFirst({ where: { name } })
            if (checkExistingCard) return existRes('card_name')

        }

        const coursesToDisconnect = card.supported_courses.filter(course => !courses.includes(course.id));

        //if the name only changes in product then update only the name in product and update the card
        if (name !== card.name && price === card.price) {

            const updateCardProduct = await stripe.products.update(card.productID, {
                name
            })
            if (!updateCardProduct) return badRequestRes()
        }

        //if the product price change then update the card product as well as the card
        if (price.toFixed(2) !== card.price.toFixed(2)) {

            const updateCardProduct = await stripe.products.update(card.productID, {
                name,
                default_price: '',
            });
            if (!updateCardProduct) return badRequestRes("Faild to remove default price to product")

            const deletePreviousPrice = await stripe.prices.update(card.productPriceID, {
                active: false,
            });
            if (!deletePreviousPrice) return badRequestRes("Failed to archieve default price")

            const newProductPrice = await stripe.prices.create({
                product: updateCardProduct.id,
                unit_amount: Number(price) * 100,
                currency: 'cny'
            })
            if (!newProductPrice) return badRequestRes("Failed to create new product price")

            //update the default price of the product
            const updateCardDefaultPrice = await stripe.products.update(card.productID, {
                default_price: newProductPrice.id
            })
            if (!updateCardDefaultPrice) return badRequestRes()

            //update the card in database
            const updateCard = await prisma.clientCardList.update({
                where: { id: clientCardID },
                data: {
                    productPriceID: newProductPrice.id
                }
            })
            if (!updateCard) return badRequestRes()
        }

        //if the price and name does not change then no need to update the product in stripe just the card in database
        const updateCard = await prisma.clientCardList.update({
            where: { id: clientCardID },
            data: {
                balance, validity, invoice, repeat_purchases, departmentID, available, name, price,
                online_renews,
                supported_courses: {
                    connect: courses.map((id: string) => ({ id })),
                    disconnect: coursesToDisconnect.map(course => ({ id: course.id }))
                },
                supported_suppliers: {
                    deleteMany: {
                        id: {
                            not: {
                                in: suppliers.map((newSupplierPrice: any) => newSupplierPrice.supplierID)
                            }
                        }
                    },
                    create: suppliers.map((newSupplierPrice: any) => ({
                        supplier: {
                            connect: { id: newSupplierPrice.supplierID }
                        },
                        price: newSupplierPrice.price
                    }))
                }
            }
        })
        if (!updateCard) return badRequestRes()

        return okayRes()

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: NextRequest) => {

    const cardID = getSearchParams(req, 'cardID')
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        if (cardID) {

            const card = await prisma.clientCardList.findUnique({ where: { id: cardID }, include: { active: true } })
            if (!card) return notFoundRes('Card')
            // if (card.active.length > 0) return badRequestRes("You can't delete a card that has client")

            // deactivate the product 
            const deactivateProduct = await stripe.products.update(card.productID, {
                default_price: '',
                active: false
            })
            if (!deactivateProduct) return badRequestRes()

            // deactiate the product price
            const deleteProductPrice = await stripe.prices.update(card.productPriceID, { active: false })
            if (!deleteProductPrice) return badRequestRes()

            //delete the card
            const deleteCard = await prisma.clientCardList.delete({ where: { id: cardID } })
            if (!deleteCard) return badRequestRes()

            //return 200 response
            return okayRes()

        }

        return notFoundRes('Card')

    } catch (error) {
        console.error(error)
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}