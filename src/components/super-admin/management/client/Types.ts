export interface ClientsProps {
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
    departments: string[] | null
}

export interface DepartmentsProps {
    id: string,
    name: string,
    date: string
}

export interface NewClientForm {
        name: string
        user_name: string
        password: string
        email: string
        phone_number: string
        departments: string[] | [];
        note: string;
        origin: any;
        address: string;
        gender: string;
        profile: string;
        organization: string;
    }
