import { ClientCard, ClientCardList } from "./clientCardType"
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
    tags: string[]
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
    payment_schedule: string
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
    supported_cards: ClientCard[]
    created_at: string
    updated_at: string
}

interface TotalCourse {
    total: string
    selected: string
    searched: string
}

interface SupplierPrice {
    id: string
    supplier: Supplier
    card: ClientCardList
    price: number
    clientCardID: string
    supplierID: string
    cardID: string
}

export type { SupplierFormDataProps, SupplierPrice, Courses, Supplier, TotalSupplier, SupplierMeetingInfo, TotalCourse }

