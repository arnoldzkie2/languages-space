import { TotalProps } from '@/lib/types/super-admin/globalType'
import axios from 'axios'
import { create } from 'zustand'
import { totalClientsValue } from './clientStore'
import { SupplierEarnings } from '@prisma/client'

interface Props {
    selectedEarnings: SupplierEarnings[]
    setSelectedEarnings: (deductions: SupplierEarnings[]) => void
    supplierEarnings: SupplierEarnings[]
    getSupplierEarnings: (supplierID: string) => Promise<void>,
    totalEarnings: TotalProps
    setTotalEarnings: (total: TotalProps) => void
}

const useSupplierEarningsStore = create<Props>((set, get) => ({
    supplierEarnings: [],
    getSupplierEarnings: async (supplierID: string) => {
        try {

            const { data } = await axios.get('/api/supplier/balance/earnings', { params: { supplierID } })

            if (data.ok) set({ supplierEarnings: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    selectedEarnings: [],
    setSelectedEarnings: (deductions: SupplierEarnings[]) => set({ selectedEarnings: deductions }),
    totalEarnings: totalClientsValue,
    setTotalEarnings: (total: TotalProps) => set({ totalEarnings: total })
}))

export default useSupplierEarningsStore