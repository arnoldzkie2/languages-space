import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import axios, { AxiosError } from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { toast } from 'sonner'

const totalCards = {
    selected: '',
    searched: '',
    total: ''
}

const clientCardValue = {
    id: '',
    name: '',
    price: 0,
    balance: 0,
    validity: 0,
    prepaid: true,
    invoice: false,
    available: false,
    online_renews: false,
    repeat_purchases: false,
}

export { clientCardValue }

interface ClientCardProps {
    totalCards: TotalProps
    clientCards: ClientCard[]
    getClientCards: (clientID: string) => Promise<void>
    clientCardData: ClientCard | null
    viewClientCard: boolean
    deleteClientCardModal: boolean
    openDeleteClientCardModal: (card: ClientCard) => void

    renewClientCard: ({ e, clientCardID, clientID }: {
        e: React.MouseEvent;
        clientID: string;
        clientCardID: string;
    }) => Promise<void>
    unbindClientCard: ({ e, clientID, clientCardID }: {
        e: React.FormEvent;
        clientCardID: string;
        clientID: string;
    }) => Promise<string | number | undefined>

    closeClientCardModal: () => void
    closeDeleteClientCardModal: () => void
    openViewClientCard: (card: ClientCard) => void
    setTotalCards: (total: TotalProps) => void
}

const useAdminClientCardStore = create<ClientCardProps>((set, get) => ({
    clientCards: [],
    getClientCards: async (clientID: string) => {

        try {
            const { data } = await axios.get('/api/client/card', { params: { clientID } })
            if (data.ok) set({ clientCards: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    renewClientCard: async ({ e, clientCardID, clientID }: { e: React.MouseEvent, clientID: string, clientCardID: string }) => {

        const { setIsLoading } = useGlobalStore.getState()
        e.preventDefault()

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/client/card/renew', { clientCardID })
            if (data.ok) {
                setIsLoading(false)
                get().getClientCards(clientID)
                toast("Success! The card has been successfully renewed.")
            }

        } catch (error: any) {
            setIsLoading(false);
            if (error instanceof AxiosError) {
                console.error(error);
                if (error.response?.data?.msg) {
                    toast(error.response.data.msg);
                } else {
                    toast('Something went wrong');
                }
            } else {
                console.error(error);
                toast('Something went wrong');
            }
        }
    },
    unbindClientCard: async ({ e, clientID, clientCardID }: { e: React.FormEvent, clientCardID: string, clientID: string }) => {

        const { setIsLoading } = useGlobalStore.getState()
        e.preventDefault()
        try {

            setIsLoading(true)
            const { data } = await axios.delete(`/api/client/card`, { params: { clientCardID } })

            if (data.ok) {
                setIsLoading(false)
                get().getClientCards(clientID)
                get().closeDeleteClientCardModal()
                toast('Success! The card has been successfully unlinked from client.')
            }

        } catch (error) {
            setIsLoading(false);
            if (error instanceof AxiosError) {
                console.error(error);
                if (error.response?.data?.msg) {
                    return toast(error.response.data.msg);
                } else {
                    toast('Something went wrong');
                }
            } else {
                console.error(error);
                toast('Something went wrong');
            }
        }
    },
    totalCards: totalCards,
    viewCard: false,
    viewClientCard: false,
    cardData: null,
    deleteCardModal: false,
    deleteClientCardModal: false,
    clientCardData: null,
    setTotalCards: (total: TotalProps) => set({ totalCards: total }),
    closeDeleteClientCardModal: () => set({ deleteClientCardModal: false, clientCardData: null }),
    openDeleteClientCardModal: (card: ClientCard) => set({ clientCardData: card, deleteClientCardModal: true }),
    closeClientCardModal: () => set({ clientCardData: null, viewClientCard: false }),
    openViewClientCard: (card: ClientCard) => set({ clientCardData: card, viewClientCard: true }),

}))

export default useAdminClientCardStore