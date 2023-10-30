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
    name: '',
    price: 0,
    balance: 0,
    validity: 0,
    invoice: false,
    repeat_purchases: false,
    online_purchases: false,
    online_renews: false,
    settlement_period: '',
}

export { clientCardValue }

interface ClientCardProps {
    totalCards: TotalProps
    cards: ClientCard[]
    getCards: () => Promise<void>
    viewCard: boolean
    cardData: ClientCard | null
    deleteCardModal: boolean
    clientCardData: ClientCard | null
    viewClientCard: boolean
    deleteClientCardModal: boolean
    closeViewCard: () => void
    openViewCard: (card: ClientCard) => void
    openDeleteCardModal: (card: ClientCard) => void
    openDeleteClientCardModal: (card: ClientCard) => void
    openViewClientCard: (card: ClientCard) => void
    closeDeleteCardModal: () => void
    closeClientCardModal: () => void
    closeDeleteClientCardModal: () => void
    setTotalCards: (total: TotalProps) => void
}

const useAdminClientCardStore = create<ClientCardProps>((set) => ({
    cards: [],
    getCards: async () => {

        try {
            const { data } = await axios.get('/api/client/card-list')
            if (data.ok) set({ cards: data.data })

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
    openViewCard: (card: ClientCard) => set({ viewCard: true, cardData: card }),
    closeViewCard: () => set({ viewCard: false, cardData: undefined }),
    openDeleteCardModal: (card: ClientCard) => set({ cardData: card, deleteCardModal: true }),
    closeDeleteCardModal: () => set({ cardData: undefined, deleteCardModal: false })

}))

export default useAdminClientCardStore