import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import axios from 'axios'
import { create } from 'zustand'

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
    invoice: false,
    available: false,
    online_renews: false,
    repeat_purchases: false,
}

export { clientCardValue }

interface ClientCardProps {
    totalCards: TotalProps
    clientCards: ClientCard[]
    getClientCards: () => Promise<void>
    clientCardData: ClientCard | null
    viewClientCard: boolean
    deleteClientCardModal: boolean
    openDeleteClientCardModal: (card: ClientCard) => void
    closeClientCardModal: () => void
    closeDeleteClientCardModal: () => void
    openViewClientCard: (card: ClientCard) => void
    setTotalCards: (total: TotalProps) => void
}

const useAdminClientCardStore = create<ClientCardProps>((set) => ({
    clientCards: [],
    getClientCards: async () => {

        try {
            const { data } = await axios.get('/api/client/card-list')
            if (data.ok) set({ clientCards: data.data })

        } catch (error) {
            console.log(error);
            alert('Something went wrong')

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