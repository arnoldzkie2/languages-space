import { ClientCard } from '@/lib/types/super-admin/clientCardType'
import axios from 'axios'
import { create } from 'zustand'

const clientCardValue = {
    name: '',
    price: 0,
    balance: 0,
    validity: '',
    invoice: false,
    repeat_purchases: false,
    online_purchases: false,
    online_renews: false,
    settlement_period: ''
}

export { clientCardValue }

interface ClientCardProps {

    cards: ClientCard[]
    getCards: () => Promise<void>
    viewCard: boolean
    cardData: ClientCard | undefined
    openViewCard: (card: ClientCard) => void
    closeViewCard: () => void
    deleteCardModal: boolean
    openDeleteCardModal: (card: ClientCard) => void
    closeDeleteCardModal: () => void
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
    viewCard: false,
    cardData: undefined,
    deleteCardModal: false,
    openViewCard: (card: ClientCard) => set({ viewCard: true, cardData: card }),
    closeViewCard: () => set({ viewCard: false, cardData: undefined }),
    openDeleteCardModal: (card: ClientCard) => set({ cardData: card, deleteCardModal: true }),
    closeDeleteCardModal: () => set({ cardData: undefined, deleteCardModal: false })

}))

export default useAdminClientCardStore