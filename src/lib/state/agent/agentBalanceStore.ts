import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import axios from 'axios'
import { AgentBalance, AgentBalanceTransactions, AgentDeductions, AgentEarnings } from '@prisma/client'
import useSupplierBalanceStore from '../supplier/supplierBalanceStore'
import useDepartmentStore from '../super-admin/departmentStore'
import { toast } from 'sonner'

interface AgentBalanceStoreProps {
    transactions: AgentBalanceTransactions[] | null
    getTransactions: () => Promise<void>
    balance: AgentBalance | null
    setBalance: (balance: AgentBalance) => void
    getBalance: () => Promise<void>
    payment_address: string
    setPaymentAddress: (info: string) => void
    updatePaymentAddress: (e: React.FormEvent) => Promise<void>
    isCashoutAvailable: (schedule: string) => boolean
    deductions: AgentDeductions[] | null
    getDeductions: () => Promise<void>
    earnings: AgentEarnings[] | null
    getEarnings: () => Promise<void>
    confirmPaymentModal: boolean
    singleTransaction: AgentBalanceTransactions | null
    openConfirmPaymentModal: (transac: AgentBalanceTransactions) => void
    closeConfirmPaymentModal: () => void
    confirmPaymentRequest: (e: React.FormEvent) => Promise<void>
    cashout: boolean
    toggleCashout: () => void
}

const useAgentBalanceStore = create<AgentBalanceStoreProps>((set, get) => ({
    transactions: null,
    getTransactions: async () => {

        const departmentID = useDepartmentStore.getState().departmentID
        try {

            const { data } = await axios.get('/api/agent/balance/transactions', {
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
    setBalance: (balance: AgentBalance) => set({ balance }),
    getBalance: async () => {
        try {
            const { data } = await axios.get('/api/agent/balance')
            if (data.ok) set({ balance: data.data, payment_address: data.data.payment_address })
        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    payment_address: '',
    setPaymentAddress: (info: string) => set({ payment_address: info }),
    updatePaymentAddress: async (e: React.FormEvent) => {
        e.preventDefault()
        const setErr = useGlobalStore.getState().setErr
        const setOkMsg = useGlobalStore.getState().setOkMsg
        const setIsLoading = useGlobalStore.getState().setIsLoading
        const payment_address = get().payment_address
        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/agent', { payment_address })
            if (data.ok) {
                toast('Success! payment address updated')
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
    isCashoutAvailable: () => {

        const currentDateTime = new Date();

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

    },
    deductions: null,
    getDeductions: async () => {
        try {
            const { data } = await axios.get('/api/agent/balance/deductions')
            if (data.ok) set({ deductions: data.data })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    earnings: null,
    getEarnings: async () => {
        try {
            const { data } = await axios.get('/api/agent/balance/earnings')
            if (data.ok) set({ earnings: data.data })
        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    },
    confirmPaymentModal: false,
    singleTransaction: null,
    openConfirmPaymentModal: (transac: AgentBalanceTransactions) => set({ confirmPaymentModal: true, singleTransaction: transac }),
    closeConfirmPaymentModal: () => set({ confirmPaymentModal: false, singleTransaction: null }),
    confirmPaymentRequest: async (e: React.FormEvent) => {
        e.preventDefault()
        const { singleTransaction, closeConfirmPaymentModal, getTransactions } = get()
        const { setErr, setIsLoading, setOkMsg } = useGlobalStore.getState()
        try {

            setIsLoading(true)

            if (!singleTransaction) return closeConfirmPaymentModal()

            const { data } = await axios.post('/api/supplier/balance/transactions/confirm', {
                transactionID: singleTransaction.id
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! payment request created.")
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
    },
    cashout: false,
    toggleCashout: () => set((state) => ({ cashout: !state.cashout })),
    returnCommissionRate: ({ rate, type, currency }: { rate: string, type: string, currency: string }) => {

        const returnCurrency = useSupplierBalanceStore.getState().returnCurrency

        if (type === 'fixed') {
            //return currency and rate if it's fixed ex: $10
            return `${returnCurrency(currency)}${rate}`
        } else if (type === 'percentage') {
            //return commission rate as percentage
            return `${rate}%`
        }
    }
}))

export default useAgentBalanceStore