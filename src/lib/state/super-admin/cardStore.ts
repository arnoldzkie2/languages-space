import { ClientCardList } from '@/lib/types/super-admin/clientCardType'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import axios from 'axios'
import { create } from 'zustand'
import useAdminGlobalStore from './globalStore'

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
    available: false,
    online_renews: false,
    repeat_purchases: false,
    settlement_period: '',
}

export { clientCardValue }

interface ClientCardProps {
    totalCards: TotalProps
    cards: ClientCardList[]
    getCards: () => Promise<void>
    viewCard: boolean
    cardData: ClientCardList | null
    deleteCardModal: boolean
    closeViewCard: () => void
    openViewCard: (card: ClientCardList) => void
    openDeleteCardModal: (card: ClientCardList) => void
    closeDeleteCardModal: () => void
    setTotalCards: (total: TotalProps) => void
}

const useAdminCardStore = create<ClientCardProps>((set) => ({
    cards: [],
    getCards: async () => {

        const { departmentID } = useAdminGlobalStore.getState()

        try {
            const { data } = await axios.get(`/api/client/card-list${departmentID ? `?departmentID=${departmentID}` : ''}`)
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
    openViewCard: (card: ClientCardList) => set({ viewCard: true, cardData: card }),
    closeViewCard: () => set({ viewCard: false, cardData: undefined }),
    openDeleteCardModal: (card: ClientCardList) => set({ cardData: card, deleteCardModal: true }),
    closeDeleteCardModal: () => set({ cardData: undefined, deleteCardModal: false })

}))

export default useAdminCardStore