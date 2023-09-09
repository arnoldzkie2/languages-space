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
    user_name: string
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
    date: string
    departments: Department[]
}

interface SupplierFormDataProps {
    profile: string
    name: string
    email: string
    phone_number: string
    password: string
    address: string
    payment_info: string
    user_name: string
    departments: string[]
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
}


export type { SupplierFormDataProps, Supplier, TotalSupplier, SupplierMeetingInfo }

