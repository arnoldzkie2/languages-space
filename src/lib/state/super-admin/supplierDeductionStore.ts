import { TotalProps } from '@/lib/types/super-admin/globalType'
import axios from 'axios'
import { create } from 'zustand'
import { totalClientsValue } from './clientStore'
import { SupplierDeductions } from '@prisma/client'

interface Props {
    selectedDeductions: SupplierDeductions[]
    setSelectedDeductions: (deductions: SupplierDeductions[]) => void
    supplierDeductions: SupplierDeductions[]
    getSupplierDeductions: (supplierID: string) => Promise<void>,
    totalDeductions: TotalProps
    setTotalDeductions: (total: TotalProps) => void
}

const useSupplierDeductionStore = create<Props>((set, get) => ({
    supplierDeductions: [],
    getSupplierDeductions: async (supplierID: string) => {
        try {

            const { data } = await axios.get('/api/supplier/balance/deductions', { params: { supplierID } })

            if (data.ok) set({ supplierDeductions: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    selectedDeductions: [],
    setSelectedDeductions: (deductions: SupplierDeductions[]) => set({ selectedDeductions: deductions }),
    totalDeductions: totalClientsValue,
    setTotalDeductions: (total: TotalProps) => set({ totalDeductions: total })
}))

export default useSupplierDeductionStore