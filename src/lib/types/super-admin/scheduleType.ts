import { Booking } from "./bookingType"
import { Supplier } from "./supplierTypes"

interface SupplierSchedule {
    id: string
    date: string
    time: string
    status: string
    supplier: Supplier
    clientName: string | null
    clientID: string | null
    supplierID: string
    booking: Booking | null
    bookingID: string | null
    created_at: string
    updated_at: string
}

export type { SupplierSchedule }
