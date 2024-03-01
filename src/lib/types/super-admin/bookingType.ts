import { Booking, Supplier } from "@prisma/client"
import { Client } from "./clientType"
import { Department } from "./globalType"
import { SupplierSchedule } from "./scheduleType"
import { Courses } from "./supplierTypes"

interface BookingProps extends Booking {
    course: Courses
    schedule: SupplierSchedule
    supplier: Supplier
    client: Client
    client_comment: boolean
    supplier_comment: boolean
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

export type { BookingProps, BookingRequest }