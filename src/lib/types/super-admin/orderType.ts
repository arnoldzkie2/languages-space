import { Department } from "@/lib/state/super-admin/globalStore"
import { ClientCard } from "./clientCardType"
import { Client } from "./clientType"

interface Order {
    id: string
    name: string
    client: Client
    client_id: string
    card: ClientCard
    card_id: string
    quantity: number
    price: number
    operator: string
    note: string | null
    status: string
    invoice_number: string | null
    express_number: string | null
    date: string
    departments: Department[]
}

interface OrderFormValue {
    client: Client | null
    card: ClientCard | null
    name: string;
    express_number: string;
    status: string;
    note: string;
    invoice_number: string;
    quantity: string;
}

export type { Order, OrderFormValue }