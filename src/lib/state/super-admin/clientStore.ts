import { TotalProps } from '@/lib/types/super-admin/globalType'
import { create } from 'zustand'
import axios from 'axios'
import useDepartmentStore from './departmentStore'
import { Client, ClientCard } from '@prisma/client'

const newClientFormValue = {
    name: '',
    card: null,
    username: '',
    password: '',
    email: '',
    phone_number: '',
    departments: [],
    note: '',
    origin: '',
    address: '',
    gender: '',
    profile_key: '',
    profile_url: '',
    organization: ''
}

const totalClientsValue = {
    total: '',
    searched: '',
    selected: ''
}

const ManageClientSearchQueryValue = {
    username: '',
    phone_number: '',
    organization: '',
    origin: '',
    note: '',
    cards: false
}


interface ClientProps extends Client {
    cards: boolean
    orders: boolean
    agent: {
        username: string
    } | null
}

export type { ClientProps }

export { totalClientsValue, ManageClientSearchQueryValue, newClientFormValue }

interface ClientStoreProps {
    clients: ClientProps[]
    method: string
    clientData: ClientProps | undefined
    deleteModal: boolean
    totalClients: TotalProps
    viewClientModal: boolean
    clientCards: ClientCard[]
    selectedClients: ClientProps[]
    clientSelectedID: string
    setClients: (allClients: ClientProps[]) => void
    setMethod: (name: string) => void
    setClientData: (data: ClientProps) => void
    setTotalClients: (total: TotalProps) => void
    closeViewModal: () => void
    viewClient: (client: ClientProps) => void
    closeDeleteModal: () => void
    deleteWarning: (client: ClientProps) => void
    setSelectedClients: (clients: ClientProps[]) => void
    getClients: () => Promise<void>
    setClientSelectedID: (clientID: string) => void
    clientWithCards: ClientProps[]
    getClientsWithCards: () => Promise<void>
    setClientCards: (cards: ClientCard[]) => void
    getClientCards: (clientID: string) => Promise<void>
}

const useAdminClientStore = create<ClientStoreProps>((set) => ({
    clients: [],
    clientWithCards: [],
    method: '',
    clientData: undefined,
    deleteModal: false,
    totalClients: totalClientsValue,
    viewClientModal: false,
    selectedClients: [],
    clientCards: [],
    getClientCards: async (clientID: string) => {
        try {
            const { data } = await axios.get('/api/booking/client/card', {
                params: { clientID }
            })

            if (data.ok) {
                set({ clientCards: data.data })
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }

    },
    clientSelectedID: '',
    setClientCards: (cards: ClientCard[]) => set({ clientCards: cards }),
    setClientSelectedID: (clientID: string) => set({ clientSelectedID: clientID }),
    setClients: (allClients: ClientProps[]) => set({ clients: allClients }),
    setMethod: (name: string) => set(state => ({ method: name })),
    setClientData: (data: ClientProps) => set(state => ({ clientData: data })),
    setTotalClients: (total: TotalProps) => set(state => ({ totalClients: total })),
    closeViewModal: () => set(state => ({ viewClientModal: false, clientData: undefined })),
    viewClient: (client: ClientProps) => set(state => ({ viewClientModal: true, clientData: client })),
    closeDeleteModal: () => set({ deleteModal: false, clientData: undefined }),
    deleteWarning: (client: ClientProps) => set(state => ({ deleteModal: true, clientData: client, clientSelectedID: '' })),
    setSelectedClients: (clients: ClientProps[]) => set(state => ({ selectedClients: clients })),
    getClients: async () => {
        try {
            const { departmentID } = useDepartmentStore.getState()
            

            const { data } = await axios.get(`/api/client${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) set({ clients: data.data.clients })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getClientsWithCards: async () => {
        try {
            const { departmentID } = useDepartmentStore.getState()
            const { data } = await axios.get(`/api/booking/client/card${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) set({ clientWithCards: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
}))

export default useAdminClientStore
