import { TotalProps } from '@/lib/types/super-admin/globalType'
import { Order } from '@/lib/types/super-admin/orderType'
import axios from 'axios'
import { create } from 'zustand'

const ManageOrderSearchValue = {
    name: '',
    price: '',
    express_number: '',
    status: '',
    note: '',
    invoice_number: '',
    client_name: '',
    quantity: '',
    operator: '',
    date: ''
}

const newOrderFormValue = {
    name: '',
    card: null,
    client: null,
    express_number: '',
    status: '',
    note: '',
    invoice_number: '',
    quantity: '',
}

const totalOrderValue = {
    total: '',
    searched: '',
    selected: ''
}

export { ManageOrderSearchValue, totalOrderValue, newOrderFormValue }

interface OrderType {
    orders: Order[]
    totalOrders: TotalProps
    selectedOrder: Order[]
    getOrders: () => Promise<void>
    openViewOrder: (order: Order) => void
    closeViewOrder: () => void
    setSelectedOrder: (orders: Order[]) => void
    setTotalOrders: (total: TotalProps) => void
}

const useAdminOrderStore = create<OrderType>((set, get) => ({
    orders: [],
    getOrders: async () => {
        try {
            const { data } = await axios.get('/api/orders')
            if (data.ok) set({ orders: data.data })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    selectedOrder: [],
    openViewOrder: (order: Order) => set({ selectedOrder: [order] }),
    closeViewOrder: () => set({ selectedOrder: [] }),
    setSelectedOrder: (orders: Order[]) => set({ selectedOrder: orders }),
    totalOrders: totalOrderValue,
    setTotalOrders: (total: TotalProps) => set({ totalOrders: total })
}))

export default useAdminOrderStore