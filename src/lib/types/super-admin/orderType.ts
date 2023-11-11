import { ClientCard, ClientCardList } from "./clientCardType"
import { Client } from "./clientType"
import { Department } from "./globalType"

interface Order {
    id: string
    name: string
    client: Client
    client_id: string
    card: ClientCardList
    card_id: string
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
    client: Client | null
    card: ClientCardList | null
    name: string;
    express_number: string;
    status: string;
    note: string;
    invoice_number: string;
    quantity: string;
}

export type { Order, OrderFormValue }