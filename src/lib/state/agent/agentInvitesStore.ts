import { Client } from '@prisma/client';
import axios from 'axios';
import { create } from 'zustand'


interface InvitesProps {
    invites: Client[] | null
    getInvites: () => Promise<void>
}

const useAgentInvitesStore = create<InvitesProps>((set, get) => ({
    invites: null,
    getInvites: async () => {

        try {

            const { data } = await axios.get('/api/agent/invites')

            if (data.ok) set({ invites: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong ((agent invites))")
        }
    }
}))

export default useAgentInvitesStore
