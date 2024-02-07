import { ClientCardList, Supplier, SupplierCommission } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { toast } from 'sonner'

interface Commissions {
    id: string
    card: ClientCardList
    supplier: Supplier
    booking_rate: number
    cardID: string
    created_at: Date
    updated_at: Date
}

export type { Commissions }

interface SupplierCommissionProps {
    commissions: Commissions[] | null
    setCommissions: (data: Commissions[]) => void
    retrieveSupplierCommission: (supplierID: string) => Promise<void>
    updateSupplierCommission: (e: React.FormEvent, supplierID: string, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>
}

const useSupplierCommissionStore = create<SupplierCommissionProps>((set, get) => ({
    commissions: null,
    setCommissions: (data: Commissions[]) => set({ commissions: data }),
    retrieveSupplierCommission: async (supplierID: string) => {
        try {

            const { data } = await axios.get("/api/supplier/commission", {
                params: { supplierID }
            })
            if (data.ok) {
                set({ commissions: data.data })
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    updateSupplierCommission: async (e: React.FormEvent, supplierID: string, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {

        const commissions = get().commissions
        const { setErr, setIsLoading } = useGlobalStore.getState()
        try {
            e.preventDefault()
            if (!supplierID) return setErr("Select Supplier")
            setIsLoading(true)
            const { data } = await axios.post("/api/supplier/commission", commissions, {
                params: {
                    supplierID
                }
            })
            if (data.ok) {
                setIsLoading(false)
                toast("Success! commissions updated.")
                setOpen(false)
            }

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }
}))

export default useSupplierCommissionStore