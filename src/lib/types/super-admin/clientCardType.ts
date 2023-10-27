import { Courses, Supplier } from "./supplierTypes"

interface ClientCard {
    id: string
    name: string
    price: number
    balance: number
    validity: string
    invoice: boolean
    repeat_purchases: boolean
    online_purchases: boolean
    online_renews: boolean
    settlement_period: string
    product_id: string
    created_at: Date
    updated_at: Date
    product_price_id: string
    supported_courses: Courses[]
    supported_suppliers: Supplier[]
}

export type { ClientCard }