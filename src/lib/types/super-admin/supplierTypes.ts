import { ClientCard } from "./clientCardType"
import { Department } from "./globalType"

interface TotalSupplier {
    total: string
    searched: string
    selected: string
}

interface Supplier {
    id: string
    profile?: string
    name: string
    username: string
    organization?: string
    payment_information: string
    phone_number?: string
    password: string
    email?: string
    address?: string
    gender?: string
    card: any
    meeting_info: any
    tags: any
    schedule: any
    origin?: string
    note?: string
    employment_status?: string
    entry: string
    departure: string
    departments: Department[]
    created_at: string
    updated_at: string
}

interface SupplierFormDataProps {
    profile: string
    name: string
    email: string
    phone_number: string
    password: string
    address: string
    payment_info: string
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
    supported_cards: ClientCard[]
    created_at: string
    updated_at: string
}

interface TotalCourse {
    total: string
    selected: string
    searched: string
}

export type { SupplierFormDataProps, Courses, Supplier, TotalSupplier, SupplierMeetingInfo, TotalCourse }

