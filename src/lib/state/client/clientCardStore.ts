import { ClientCardList } from '@/lib/types/super-admin/clientCardType'
import { ClientCard } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'

interface ClientCardStore {
    cards: ClientCard[] | null
    getCards: () => Promise<void>
    availableCards: ClientCardList[] | null,
    getAvailableCardsToBuy: () => Promise<void>
    setSelectedCardID: (cardID: string) => void
    selectedCardID: string
    checkoutCard: (e: React.FormEvent<HTMLButtonElement>, cardID: string, router: any) => Promise<void>
}

const useClientCardStore = create<ClientCardStore>((set, get) => ({
    selectedCardID: '',
    cards: null,
    availableCards: null,
    setSelectedCardID: (cardID: string) => { set({ selectedCardID: cardID }) },
    getCards: async () => {
        try {
            const { data } = await axios.get('/api/client/card')
            if (data.ok) set({ cards: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    getAvailableCardsToBuy: async () => {

        try {

            const { data } = await axios.get('/api/client/card/available')

            if (data.ok) {
                set({ availableCards: data.data })
            }

        } catch (error: any) {
            console.log(error);
            alert('Something went wrong')
        }

    },
    checkoutCard: async (e: React.FormEvent<HTMLButtonElement>, cardID: string, router: any) => {

        e.preventDefault()
        const setIsLoading = useGlobalStore.getState().setIsLoading
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/stripe/checkout', {
                cardID, quantity: 1
            })

            if (data.ok) {
                setIsLoading(false)
                router.push(data.data)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

}))

export default useClientCardStore