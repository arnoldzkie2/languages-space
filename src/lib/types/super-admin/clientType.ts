import { ClientCard } from "@prisma/client"

interface Client {
    id: string
    phone_number: string | null
    profile_key: string | null
    profile_url: string | null
    email: string | null
    gender: string | null
    name: string
    username: string
    organization: string | null
    password: string
    address: string | null
    origin: any
    note: string | null
    created_at: string
    updated_at: string
    departments: { id: string, name: string, date: string }[] | null
    cards: ClientCard[]
}

interface ClientFormData {
    id?: string
    phone_number: string
    card: ClientCard | null
    profile_url: string;
    profile_key: string
    email: string
    gender: string;
    name: string
    username: string
    organization: string;
    address: string;
    origin: any;
    note: string;
    password: string
    departments: string[];
    date?: string
}




export type { Client, ClientFormData }