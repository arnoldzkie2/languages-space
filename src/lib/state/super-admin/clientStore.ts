import { Client, ClientFormData } from '@/lib/types/super-admin/clientType'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { create } from 'zustand'
import useAdminGlobalStore from './globalStore'
import axios from 'axios'
import { ClientCard } from '@/lib/types/super-admin/clientCardType'

const newClientFormValue = {
    name: '',
    card: null,
    user_name: '',
    password: '',
    email: '',
    phone_number: '',
    departments: [],
    note: '',
    origin: '',
    address: '',
    gender: '',
    profile: '',
    organization: ''
}

const totalClientsValue = {
    total: '',
    searched: '',
    selected: ''
}

const ManageClientSearchQueryValue = {
    name: '',
    phone_number: '',
    organization: '',
    origin: '',
    note: '',
    cards: false
}

export { totalClientsValue, ManageClientSearchQueryValue, newClientFormValue }

interface ClientProps {
    clients: Client[]
    method: string
    clientData: Client | undefined
    deleteModal: boolean
    totalClients: TotalProps
    viewClientModal: boolean
    clientCards: ClientCard[]
    selectedClients: Client[]
    clientSelectedID: string
    setClients: (allClients: Client[]) => void
    setMethod: (name: string) => void
    setClientData: (data: Client) => void
    setTotalClients: (total: TotalProps) => void
    closeViewModal: () => void
    viewClient: (client: Client) => void
    closeDeleteModal: () => void
    deleteWarning: (client: Client) => void
    setSelectedClients: (clients: Client[]) => void
    getClients: () => Promise<void>
    setClientSelectedID: (clientID: string) => void
    getClientsWithCards: () => Promise<void>
    getClientCards: (clientID: string) => Promise<void>
    setClientCards: () => void
}

const useAdminClientStore = create<ClientProps>((set) => ({
    clients: [],
    method: '',
    clientData: undefined,
    deleteModal: false,
    totalClients: totalClientsValue,
    viewClientModal: false,
    selectedClients: [],
    clientCards: [],
    getClientCards: async (clientID: string) => {

        try {

            const { data } = await axios.get('/api/client', {
                params: { clientID }
            })

            if (data.ok) {
                set({ clientCards: data.data.cards })
            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }

    },
    clientSelectedID: '',
    setClientCards: () => set({ clientCards: [] }),
    setClientSelectedID: (clientID: string) => set({ clientSelectedID: clientID }),
    setClients: (allClients: Client[]) => set({ clients: allClients }),
    setMethod: (name: string) => set(state => ({ method: name })),
    setClientData: (data: Client) => set(state => ({ clientData: data })),
    setTotalClients: (total: TotalProps) => set(state => ({ totalClients: total })),
    closeViewModal: () => set(state => ({ viewClientModal: false, clientData: undefined })),
    viewClient: (client: Client) => set(state => ({ viewClientModal: true, clientData: client })),
    closeDeleteModal: () => set({ deleteModal: false, clientData: undefined }),
    deleteWarning: (client: Client) => set(state => ({ deleteModal: true, clientData: client, clientSelectedID: '' })),
    setSelectedClients: (clients: Client[]) => set(state => ({ selectedClients: clients })),
    getClients: async () => {
        try {
            const { departmentID } = useAdminGlobalStore.getState()
            const { data } = await axios.get(`/api/client${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) set({ clients: data.data })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getClientsWithCards: async () => {
        try {
            const { departmentID } = useAdminGlobalStore.getState()
            const { data } = await axios.get(`/api/client/card${departmentID && `?departmentID=${departmentID}`}`)
            if (data.ok) set({ clients: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
}))

export default useAdminClientStore
