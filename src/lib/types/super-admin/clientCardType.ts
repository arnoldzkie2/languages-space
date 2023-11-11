import { Order } from "./orderType"
import { Courses, Supplier } from "./supplierTypes"

interface ClientCard {
    id: string
    name: string
    price: number
    balance: number
    sold: number
    validity: string
    cardID: string
    invoice: boolean
    repeat_purchases: boolean
    online_renews: boolean
    settlement_period: string
    card: ClientCardList
    created_at: Date
    updated_at: Date
    quantity: number
}

interface ClientCardList {
    id: string
    quantity: number
    name: string
    sold: number
    price: number
    balance: number
    validity: string
    available: boolean
    invoice: boolean
    repeat_purchases: boolean
    online_renews: boolean
    settlement_period: string
    productID: string
    productPriceID: string
    created_at: Date
    updated_at: Date
    orders: Order[]
    supported_courses: Courses[]
    supported_suppliers: Supplier[]
    active: ClientCard[]
}

export type { ClientCard, ClientCardList }