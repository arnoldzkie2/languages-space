import { ClientCard } from "@prisma/client"
import { Order } from "./orderType"
import { AvailableSupplier, Courses  } from "./supplierTypes"

interface ClientCardProps extends ClientCard {
    card: ClientCardList
}

interface ClientCardList {
    id: string
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
    supported_suppliers: AvailableSupplier[]
    active: ClientCard[]
}

export type { ClientCardProps, ClientCardList }