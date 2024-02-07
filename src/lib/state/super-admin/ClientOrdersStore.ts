import { Order } from '@/lib/types/super-admin/orderType'
import axios from 'axios'
import { create } from 'zustand'
import { totalClientsValue } from './clientStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'

interface Props {
    clientOrders: Order[]
    getClientOrders: (clientID: string) => Promise<void>
    selectedClientOrders: Order[]
    setSelectedClientOrders: (orders: Order[]) => void
    totalClientOrders: TotalProps
    setTotalClientOrders: (total: TotalProps) => void
}

const useClientOrderStore = create<Props>((set, get) => ({
    clientOrders: [],
    getClientOrders: async (clientID: string) => {
        try {
            const { data } = await axios.get('/api/client/orders', { params: { clientID } })

            if (data.ok) set({ clientOrders: data.data })
        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    selectedClientOrders: [],
    setSelectedClientOrders: (orders: Order[]) => set({ selectedClientOrders: orders }),
    totalClientOrders: totalClientsValue,
    setTotalClientOrders: (total: TotalProps) => set({ totalClientOrders: total })

}))

export default useClientOrderStore