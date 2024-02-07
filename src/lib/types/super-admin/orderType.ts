import { Client } from "./clientType"
import { Department } from "./globalType"

interface Order {
    id: string
    name: string
    client: Client
    clientID: string
    card_name: string
    cardID: string
    quantity: number
    price: number
    operator: string
    note: string | null
    status: string
    invoice_number: string | null
    express_number: string | null
    created_at: string
    updated_at: string
    departments: Department[]
}

interface OrderFormValue {
    selectedClientID: string
    price: number
    selectedCardID: string
    name: string;
    express_number: string;
    status: string;
    note: string;
    invoice_number: string;
    quantity: string;
}

export type { Order, OrderFormValue }