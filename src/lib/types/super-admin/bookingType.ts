import { Supplier } from "@prisma/client"
import { Client } from "./clientType"
import { Department } from "./globalType"
import { SupplierSchedule } from "./scheduleType"
import { Courses, SupplierMeetingInfo } from "./supplierTypes"

interface Booking {
    id: string
    name: string
    operator: string
    status: string
    note: string | null
    scheduleID: string
    card_name: string
    supplierID: string
    quantity: number
    course: Courses
    clientID: string
    supplier_rate: number
    clientCardID: string
    price: number
    meeting_info: SupplierMeetingInfo
    created_at: string
    updated_at: string
    schedule: SupplierSchedule
    supplier: Supplier
    client: Client
    departments: Department
}

interface BookingRequest {
    id: string
    name: string
    operator: string
    status: string
    date: string
    time: string
    note: string | null
    scheduleID: string
    card_name: string
    supplierID: string
    course: Courses
    clientID: string
    clientCardID: string
    created_at: string
    updated_at: string
    supplier: Supplier
    client: Client
    meetingInfoID: string
    departments: Department
}

export type { Booking, BookingRequest }