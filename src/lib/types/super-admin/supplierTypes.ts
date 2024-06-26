import { Department, Supplier, SupplierDeductions, SupplierEarnings } from "@prisma/client"
import { ClientCardProps, ClientCardList } from "./clientCardType"
import { SupplierSchedule } from "./scheduleType"

interface TotalSupplier {
    total: string
    searched: string
    selected: string
}

interface SupplierProps extends Supplier {
    departments: Department[]
    earnings: SupplierEarnings[]
    meeting_info: SupplierMeetingInfo[]
    deductions: SupplierDeductions[]
}

// interface Supplier {
//     id: string
//     profile_key: string | null
//     profile_url: string | null
//     name: string
//     username: string
//     organization: string | null
//     payment_information: string
//     phone_number: string | null
//     password: string
//     email: string | null
//     address: string | null
//     gender: string | null
//     card: any
//     meeting_info: SupplierMeetingInfo[]
//     tags: string[]
//     schedule: SupplierSchedule[]
//     origin: string | null
//     note: string | null
//     employment_status: string
//     entry: string | null
//     departure: string | null
//     departments: Department[]
//     created_at: string
//     updated_at: string
// }

interface SupplierFormDataProps {
    id?: string
    profile_url: string
    profile_key: string
    salary: string
    name: string
    email: string
    currency: string
    phone_number: string
    booking_rate: string
    password: string
    address: string
    payment_address: string
    username: string
    departments: string[]
    meeting_info: {
        service: string
        meeting_code: string
    }[]
    organization: string
    note: string
    gender: string
    tags: string[]
    origin: string
    employment_status: string
}

interface SupplierMeetingInfo {
    id: string
    service: string
    meeting_code: string
    created_at: string
    updated_at: string
}

interface Courses {
    id: string
    name: string
    supported_cards: ClientCardProps[]
    created_at: string
    updated_at: string
}

interface TotalCourse {
    total: string
    selected: string
    searched: string
}

interface AvailableSupplier {
    id: string
    price: number
    supplier: {
        id: string
        tags: string[]
        name: string
        profile_url: string
        schedule: number
        total_bookings: number
        ratings: number
    }
}

export type { SupplierFormDataProps, AvailableSupplier, Courses, SupplierProps, TotalSupplier, SupplierMeetingInfo, TotalCourse }

