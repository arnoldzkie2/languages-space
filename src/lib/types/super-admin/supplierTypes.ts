import { ClientCard } from "./clientCardType"
import { Department } from "./globalType"
import { SupplierSchedule } from "./scheduleType"

interface TotalSupplier {
    total: string
    searched: string
    selected: string
}

interface Supplier {
    id: string
    profile_key: string | null
    profile_url: string | null
    name: string
    username: string
    organization: string | null
    payment_information: string
    phone_number: string | null
    password: string
    email: string | null
    address: string | null
    gender: string | null
    card: any
    meeting_info: SupplierMeetingInfo[]
    tags: any
    schedule: SupplierSchedule[]
    origin: string | null
    note: string | null
    employment_status: string
    entry: string | null
    departure: string | null
    departments: Department[]
    created_at: string
    updated_at: string
}

interface SupplierFormDataProps {
    id?: string
    profile_url: string
    profile_key: string
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

