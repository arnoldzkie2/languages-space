import { Client } from '@/lib/types/super-admin/clientType'
import { create } from 'zustand'
import useAdminGlobalStore from '../super-admin/globalStore';
import axios from 'axios';

interface Props {
    page: string
    client: {
        name: string;
        email: string;
        profile_url: string
        phone_number: string;
        gender: string;
        address: string;
        username: string;
    }
    setPage: (page: string) => void
    setClient: (client: {
        name: string;
        email: string;
        profile_url: string;
        phone_number: string;
        gender: string;
        address: string;
        username: string;
    }) => void
    getClient: (clientID: string) => Promise<void>
}

const useClientStore = create<Props>((set, get) => ({
    page: 'profile',
    setPage: (page: string) => set({ page }),
    client: {
        name: '',
        email: '',
        profile_url: '',
        phone_number: '',
        gender: '',
        address: '',
        username: ''
    },
    setClient: (client: {
        name: string;
        email: string;
        profile_url: string
        phone_number: string;
        gender: string;
        address: string;
        username: string;
    }) => set({ client }),
    getClient: async (clientID: string) => {

        const { setErr } = useAdminGlobalStore.getState()
        try {

            const { data } = await axios.get('/api/client', { params: { clientID } })
            if (data.ok) set({ client: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }
}))

export default useClientStore