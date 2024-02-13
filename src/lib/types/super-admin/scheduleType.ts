import { Supplier } from "@prisma/client"
import { Booking } from "./bookingType"

interface SupplierSchedule {
    id: string
    date: string
    time: string
    status: string
    supplier: Supplier
    clientUsername: string | null
    clientID: string | null
    supplierID: string
    booking: Booking[] | null
    created_at: string
    updated_at: string
}

export type { SupplierSchedule }
