export interface ClientsProps {
    id: string
    phone_number: string | null
    email: string | null
    gender: string | null
    name: string
    user_name: string
    type: any
    organization: string | null
    password: string
    address: string | null
    origin: string | null
    tags: string | null
    note: string | null
    date: string
    departments: string[] | null
}

export interface DepartmentsProps {
    id: string,
    name: string,
    date: string
}