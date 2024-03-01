import { SupplierBalance, SupplierDeductions, SupplierEarnings } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { SupplierBalanceTransaction } from '@/lib/types/super-admin/supplierBalanceType'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { totalClientsValue } from '../super-admin/clientStore'
import useDepartmentStore from '../super-admin/departmentStore'
import { toast } from 'sonner'

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
    confirmPaymentModal: boolean
    singleTransaction: SupplierBalanceTransaction | null
    openConfirmPaymentModal: (transac: SupplierBalanceTransaction) => void
    closeConfirmPaymentModal: () => void
    confirmPaymentRequest: (e: React.FormEvent) => Promise<void>
    totalTransactions: TotalProps
    setTotalTransactions: (totals: TotalProps) => void
}

const useSupplierBalanceStore = create<SupplierBalanceStore>((set, get) => ({
    transactions: null,
    totalTransactions: totalClientsValue,
    setTotalTransactions: (totals: TotalProps) => set({ totalTransactions: totals }),
    getTransactions: async () => {

        const departmentID = useDepartmentStore.getState().departmentID
        try {

            const { data } = await axios.get('/api/supplier/balance/transactions', {
                params: {
                    departmentID: departmentID || ''
                }
            })
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
    isCashoutAvailable: () => {
        const currentDateTime = new Date();

        // Calculate the difference in days to Saturday (considering Sunday as the first day of the week)
        const daysUntilSaturday = (6 - currentDateTime.getDay() + 7) % 7;

        // Set the time for the upcoming Saturday 9:00 PM
        const cashoutWeeklyStart = new Date(currentDateTime);
        cashoutWeeklyStart.setDate(currentDateTime.getDate() + daysUntilSaturday);
        cashoutWeeklyStart.setHours(21, 0, 0, 0);

        // Set the time for the upcoming Sunday 6:00 PM
        const cashoutWeeklyEnd = new Date(cashoutWeeklyStart);
        cashoutWeeklyEnd.setDate(cashoutWeeklyEnd.getDate() + 1); // Move to Sunday
        cashoutWeeklyEnd.setHours(18, 0, 0, 0);

        // Set the time for the last day of the current month at 9:00 PM
        const lastDayOfMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0);
        const cashoutMonthlyStart = new Date(lastDayOfMonth);
        cashoutMonthlyStart.setHours(21, 0, 0, 0);

        // Set the time for the first day of the next month at 6:00 PM
        const firstDayOfNextMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 1);
        const cashoutMonthlyEnd = new Date(firstDayOfNextMonth);
        cashoutMonthlyEnd.setHours(18, 0, 0, 0);

        // Check if the current date and time fall within the allowed cashout periods
        const isWeeklyCashoutAvailable = currentDateTime >= cashoutWeeklyStart && currentDateTime <= cashoutWeeklyEnd;
        const isMonthlyCashoutAvailable = currentDateTime >= cashoutMonthlyStart && currentDateTime <= cashoutMonthlyEnd;

        return isWeeklyCashoutAvailable || isMonthlyCashoutAvailable;
    },
    toggleCashout: () => set((state) => ({ cashout: !state.cashout })),
    payment_address: '',
    setPaymentAddress: (info: string) => set({ payment_address: info }),
    updatePaymentInfo: async (e: React.FormEvent) => {
        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const payment_address = get().payment_address
        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/supplier', { payment_address })
            if (data.ok) {
                toast('Success! payment address updated.')
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
    setBalance: (balance: SupplierBalance) => set({ balance }),
    confirmPaymentModal: false,
    singleTransaction: null,
    openConfirmPaymentModal: (transac: SupplierBalanceTransaction) => set({ confirmPaymentModal: true, singleTransaction: transac }),
    closeConfirmPaymentModal: () => set({ confirmPaymentModal: false, singleTransaction: null }),
    confirmPaymentRequest: async (e: React.FormEvent) => {
        e.preventDefault()
        const { singleTransaction, closeConfirmPaymentModal, getTransactions } = get()
        const { setErr, setIsLoading } = useGlobalStore.getState()
        try {

            setIsLoading(true)
            if (!singleTransaction) return closeConfirmPaymentModal()

            const { data } = await axios.post('/api/supplier/balance/transactions/completed', {
                transactionID: singleTransaction.id
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! payment request completed.")
                closeConfirmPaymentModal()
                getTransactions()
            }

        } catch (error: any) {
            setIsLoading(false)
            if (error.reponse.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }
}))

export default useSupplierBalanceStore