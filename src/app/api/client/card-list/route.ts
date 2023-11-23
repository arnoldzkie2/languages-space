import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";
import stripe from "@/lib/utils/getStripe";

export const POST = async (req: Request) => {

    const { quantity, name, price, balance, validity, invoice, repeat_purchases, available, online_renews, settlement_period, courses, suppliers, departmentID } = await req.json()

    try {

        //check if department exist
        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        //create a new card if the card doesn't exist in database
        const newCard = await prisma.clientCardList.create({
            data: {
                name, price, balance, validity, invoice, repeat_purchases, available,
                online_renews, quantity, settlement_period, productID: '', productPriceID: '', sold: 0,
                supported_courses: {
                    connect: courses.map((id: string) => ({ id }))
                }, department: { connect: { id: departmentID } }
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
                        price: supplierPrice.price,
                        clientCardID: newCard.id
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
            unit_amount: newCard.price * 100,
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

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientCardID = searchParams.get('clientCardID')
    const departmentID = searchParams.get('departmentID')

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

        if (clientCardID) {

            const card = await prisma.clientCardList.findUnique({
                where: { id: clientCardID }, include: { supported_courses: true, supported_suppliers: true }

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
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientCardID = searchParams.get('clientCardID')

    const { name, price, balance, validity, invoice, repeat_purchases, quantity, available, departmentID,
        online_renews, settlement_period, courses, suppliers } = await req.json()

    try {

        const department = await prisma.department.findUnique({ where: { id: departmentID } })
        if (!department) return notFoundRes('Department')

        if (clientCardID) {

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

                const updateCard = await prisma.clientCardList.update({
                    where: { id: clientCardID },
                    data: {
                        balance, validity, invoice, repeat_purchases, departmentID, available,
                        online_renews, settlement_period, name, quantity,
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
                                price: newSupplierPrice.price,
                                clientCardID: card.id
                            }))
                        }
                    }, include: { supported_courses: true, supported_suppliers: true }
                })
                if (!updateCard) return badRequestRes()

                return okayRes(updateCard)
            }

            //if the product price change then update the card product as well as the card
            if (price !== card.price) {

                const updateCardProduct = await stripe.products.update(card.productID, {
                    name, default_price: ''
                })
                if (!updateCardProduct) return badRequestRes()

                //remove the previous price
                const deletePreviousPrice = await stripe.prices.update(card.productPriceID, {
                    active: false,
                })
                if (!deletePreviousPrice) return badRequestRes()

                //create a new product price
                const newProductPrice = await stripe.prices.create({
                    product: updateCardProduct.id,
                    unit_amount: price * 100,
                    currency: 'usd'
                })
                if (!newProductPrice) return badRequestRes()

                //update the default price of the product
                const updateCardDefaultPrice = await stripe.products.update(updateCardProduct.id, {
                    default_price: newProductPrice.id
                })
                if (!updateCardDefaultPrice) return badRequestRes()

                //update the card in database
                const updateCard = await prisma.clientCardList.update({
                    where: { id: clientCardID },
                    data: {
                        quantity, price, balance, validity, invoice, repeat_purchases, departmentID, available,
                        online_renews, settlement_period, productPriceID: newProductPrice.id, name,
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
                                price: newSupplierPrice.price,
                                clientCardID: card.id
                            }))
                        }

                    }
                })
                if (!updateCard) return badRequestRes()

                return okayRes()

            }

            //if the price and name does not change then no need to update the product in stripe just the card in database
            const updateCard = await prisma.clientCardList.update({
                where: { id: clientCardID },
                data: {
                    balance, validity, quantity, invoice, repeat_purchases, departmentID, available,
                    online_renews, settlement_period,
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
                            price: newSupplierPrice.price,
                            clientCardID: card.id
                        }))
                    }
                }
            })
            if (!updateCard) return badRequestRes()

            return okayRes()

        }

        //return notfound if clientCardID is not included
        return notFoundRes('clientCardID')

    } catch (error) {
        console.error(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientCardID = searchParams.get('clientCardID')

    try {

        if (clientCardID) {

            const card = await prisma.clientCardList.findUnique({ where: { id: clientCardID } })
            if (!card) return notFoundRes('Client Card')

            const retrieveProduct = await stripe.products.retrieve(card.productID)
            if(!retrieveProduct) return notFoundRes('Product')
            
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
            const deleteCard = await prisma.clientCardList.delete({ where: { id: clientCardID } })
            if (!deleteCard) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('clientCardID')

    } catch (error) {
        console.error(error)
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}