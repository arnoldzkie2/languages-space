import { ClientCard } from "./clientCardType"
import { Client } from "./clientType"
import { Department } from "./globalType"
import { SupplierSchedule } from "./scheduleType"
import { Supplier, SupplierMeetingInfo } from "./supplierTypes"

interface Booking {
    id: string
    name: string
    operator: string
    status: string
    note: string | null
    scheduleID: string
    supplierID: string
    clientID: string
    meetingInfoID: string
    schedule: SupplierSchedule
    supplier: Supplier
    client: Client
    client_card: ClientCard
    price: number
    meeting_info: SupplierMeetingInfo
    departments: Department[]
    created_at: string
    updated_at: string
}

export type { Booking }