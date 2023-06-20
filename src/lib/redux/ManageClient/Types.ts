export interface ClientsProps {
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
    departments: string[] | null
}

export interface NewClientForm {
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
    departments: string[] | [];
    date?: string
}

export interface DepartmentsProps {
    id: string,
    name: string,
    date: string
}

export interface TotalClientsState {
    total: string;
    searched: string;
    selected: string;
}

export interface ManageClientState {
    clients: ClientsProps[]
    newClient: boolean
    newClientForm: NewClientForm
    method: string
    clientData: ClientsProps | undefined
    deleteModal: boolean
    operation: boolean
    totalClients: TotalClientsState
    clientSelectedID: string | undefined
    viewClientModal: boolean
    eye: boolean
    selectedClients: ClientsProps[]
}