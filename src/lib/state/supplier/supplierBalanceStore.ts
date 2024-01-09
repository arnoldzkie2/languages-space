import { SupplierBalance, SupplierDeductions, SupplierEarnings } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { SupplierBalanceTransaction } from '@/lib/types/super-admin/supplierBalanceType'

interface SupplierBalanceStore {
    balance: SupplierBalance | null
    getBalance: () => Promise<void>
    transactions: SupplierBalanceTransaction[] | null
    getTransactions: () => Promise<void>
    earnings: SupplierEarnings[] | null
    getEarnings: () => Promise<void>
    deductions: SupplierDeductions[] | null
    getDeductions: () => Promise<void>
    cashout: boolean
    payment_address: string,
    setPaymentAddress: (info: string) => void
    toggleCashout: () => void
    isCashoutAvailable: (schedule: string) => boolean
    returnCurrency: (currency: string) => "$" | "₱" | "₫" | "¥" | "Unknown Currency"
    updatePaymentInfo: (e: React.FormEvent) => Promise<void>
    setBalance: (balance: SupplierBalance) => void
}

const useSupplierBalanceStore = create<SupplierBalanceStore>((set, get) => ({
    transactions: null,
    getTransactions: async () => {
        try {

            const { data } = await axios.get('/api/supplier/balance/transactions')
            if (data.ok) set({ transactions: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    balance: null,
    cashout: false,
    getBalance: async () => {
        try {
            const { data } = await axios.get('/api/supplier/balance')
            if (data.ok) set({ balance: data.data, payment_address: data.data.payment_address })
        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    returnCurrency: (currency: string) => {
        switch (currency) {
            case 'USD':
                return '$'
            case 'PHP':
                return '₱'
            case 'VND':
                return '₫'
            case 'RMB':
                return '¥'
            default:
                return 'Unknown Currency'
        }
    },
    earnings: null,
    getEarnings: async () => {
        try {
            const { data } = await axios.get('/api/supplier/balance/earnings')
            if (data.ok) set({ earnings: data.data })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    deductions: null,
    getDeductions: async () => {
        try {
            const { data } = await axios.get('/api/supplier/balance/deductions')
            if (data.ok) set({ deductions: data.data })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    isCashoutAvailable: (schedule: string) => {

        const currentDateTime = new Date();

        if (schedule.toLowerCase() === 'weekly') {
            //weekly logic only return true if it's saturday 9pm to sunday 6pm

            // Calculate the difference in days to Saturday (considering Sunday as the first day of the week)
            const daysUntilSaturday = (6 - currentDateTime.getDay() + 7) % 7;

            // Set the time for the upcoming Saturday 9:00 PM
            const cashoutStart = new Date(currentDateTime);
            cashoutStart.setDate(currentDateTime.getDate() + daysUntilSaturday);
            cashoutStart.setHours(21, 0, 0, 0);

            // Set the time for the upcoming Sunday 6:00 PM
            const cashoutEnd = new Date(cashoutStart);
            cashoutEnd.setDate(cashoutEnd.getDate() + 1); // Move to Sunday
            cashoutEnd.setHours(18, 0, 0, 0);

            // Check if the current date and time fall within the allowed cashout period
            return currentDateTime >= cashoutStart && currentDateTime <= cashoutEnd;

        } else if (schedule.toLocaleLowerCase() === 'monthly') {

            //monthly logic only return true if it's last day of the month at 9pm to first day of the next month 6pm

            // Set the time for the last day of the current month at 9:00 PM
            const lastDayOfMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0);
            const cashoutStart = new Date(lastDayOfMonth);
            cashoutStart.setHours(21, 0, 0, 0);

            // Set the time for the first day of the next month at 6:00 PM
            const firstDayOfNextMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 1);
            const cashoutEnd = new Date(firstDayOfNextMonth);
            cashoutEnd.setHours(18, 0, 0, 0);

            // Check if the current date and time fall within the allowed cashout period
            return currentDateTime >= cashoutStart && currentDateTime <= cashoutEnd;

        }

        return false; // Cashout is not available for other schedules
    },
    toggleCashout: () => set((state) => ({ cashout: !state.cashout })),
    payment_address: '',
    setPaymentAddress: (info: string) => set({ payment_address: info }),
    updatePaymentInfo: async (e: React.FormEvent) => {
        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setOkMsg = useGlobalStore.getState().setOkMsg
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const payment_address = get().payment_address
        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/supplier', { payment_address })
            if (data.ok) {
                setOkMsg('Success')
                setIsLoading(false)
            }
        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    setBalance: (balance: SupplierBalance) => set({ balance })
}))

export default useSupplierBalanceStore