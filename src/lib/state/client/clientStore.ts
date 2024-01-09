import { create } from 'zustand'
import axios from 'axios';
import { Session } from 'next-auth';
import { Order } from '@/lib/types/super-admin/orderType'
import { SupplierPrice } from '@/lib/types/super-admin/supplierTypes';
import useGlobalStore from '../globalStore';

interface Props {
    page: string
    orders: Order[] | null
    availableSupplier: SupplierPrice[] | null
    client: Session["user"] | null
    setPage: (page: string) => void
    setClient: (client: Session["user"]) => void
    clearAvailableSuppliers: () => void
    getClientOrders: () => Promise<void>
    getAvailableSupplier: (clientCardID: string) => Promise<void>
    updateClient: (e: React.FormEvent, signIn: any) => Promise<void>
}

const useClientStore = create<Props>((set, get) => ({
    availableSupplier: null,
    orders: null,
    clearAvailableSuppliers: () => set({ availableSupplier: null }),
    getClientOrders: async () => {

        try {

            const { data } = await axios.get('/api/client/orders')
            if (data.ok) set({ orders: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    getAvailableSupplier: async (clientCardID: string) => {

        const { client } = get()

        try {

            const { data } = await axios.get('/api/supplier/available', {
                params: { clientCardID, clientID: client?.id }
            })

            if (data.ok) set({ availableSupplier: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    page: 'profile',
    setPage: (page: string) => set({ page }),
    client: null,
    setClient: (data: Session["user"]) => set({ client: data }),
    updateClient: async (e: React.FormEvent, signIn: any) => {

        e.preventDefault()
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const setOkMsg = useGlobalStore.getState().setOkMsg
        const setErr = useGlobalStore.getState().setErr
        const client = get().client
        try {

            const { name, email, phone_number, gender, address, username, password } = client!
            setIsLoading(true)
            const { data } = await axios.patch('/api/client', {
                name, email, phone_number, gender, address
            })

            if (data.ok) {
                await signIn('credentials', {
                    username: username, password, redirect: false
                })
                setIsLoading(false)
                setOkMsg('Success')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                setTimeout(() => {
                    setErr('')
                }, 5000)
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }
}))

export default useClientStore