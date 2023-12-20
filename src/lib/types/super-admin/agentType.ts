import { Department } from "./globalType"

interface Agent {
    id: string
    profile_url: string | null
    profile_key: string | null
    name: string | null
    username: string
    password: string
    organization: string | null
    payment_information: string | null
    phone_number: string | null
    email: string | null
    address: string | null
    gender: string | null
    origin: string | null
    note: string | null
    created_at: string
    updated_at: string
    departments: Department[]
}

export type { Agent }