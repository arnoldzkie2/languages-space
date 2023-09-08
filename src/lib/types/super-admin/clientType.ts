interface Client {
    length: number
    id: string
    phone_number: string | null
    profile: string | null
    email: string | null
    gender: string | null
    name: string
    user_name: string
    organization: string | null
    password: string
    address: string | null
    origin: any
    note: string | null
    date: string
    departments: { id: string, name: string, date: string }[] | null
}

interface ClientFormData {
    id?: string
    phone_number: string
    profile: string;
    email: string
    gender: string;
    name: string
    user_name: string
    organization: string;
    address: string;
    origin: any;
    note: string;
    password: string
    departments: string[];
    date?: string
}




export type { Client, ClientFormData }