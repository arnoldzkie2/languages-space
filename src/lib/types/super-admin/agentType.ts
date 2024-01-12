import { Department } from "./globalType"

interface AgentFormDataValueProps {
    name: string;
    username: string;
    payment_address: string;
    currency: string;
    password: string;
    email: string;
    departments: string[];
    address: string;
    commission_rate: string
    commission_type: string
    origin: string
    organization: string
    gender: string;
    note: string;
    phone_number: string
    profile_url: string
    profile_key: string
}

export type { AgentFormDataValueProps }