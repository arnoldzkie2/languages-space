import axios from 'axios'
import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { TotalProps } from '@/lib/types/super-admin/globalType'
import { totalClientsValue } from './clientStore'
import { Agent } from '@prisma/client'
import { AgentFormDataValueProps } from '@/lib/types/super-admin/agentType'

const agentSearchQueryValue = {
    name: '',
    phone_number: '',
    organization: '',
    origin: '',
    note: '',
}

const agentFormDataValue = {
    name: '',
    username: '',
    payment_address: '',
    currency: '',
    password: '',
    commission_rate: '',
    commission_type: 'fixed',
    email: '',
    employment_status: '',
    departments: [],
    address: '',
    gender: '',
    note: '',
    organization: '',
    origin: '',
    phone_number: '',
    profile_url: '',
    profile_key: '',
}

export { agentSearchQueryValue, agentFormDataValue }

interface Props {
    agents: Agent[]
    agentData: Agent | null,
    selectedAgents: Agent[]
    setSelectedAgents: (agents: Agent[]) => void
    getAgents: () => Promise<void>
    totalAgent: TotalProps
    setTotalAgent: (total: TotalProps) => void
    agentFormData: AgentFormDataValueProps
    deleteAgentModal: boolean
    openDeleteAgentModal: (agent: Agent) => void
    closeDeleteAgentModal: () => void
    sendAgentPayslip: (e: React.FormEvent) => Promise<void>
}
const useAdminAgentStore = create<Props>((set, get) => ({
    agents: [],
    agentData: null,
    selectedAgents: [],
    agentFormData: agentFormDataValue,
    setSelectedAgents: (agents: Agent[]) => set({ selectedAgents: agents }),
    getAgents: async () => {
        try {

            const { departmentID } = useGlobalStore.getState()

            const { data } = await axios.get(`/api/agent${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) set({ agents: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    totalAgent: totalClientsValue,
    setTotalAgent: (total: TotalProps) => set({ totalAgent: total }),
    deleteAgentModal: false,
    openDeleteAgentModal: (agent: Agent) => set({ deleteAgentModal: true, agentData: agent }),
    closeDeleteAgentModal: () => set({ deleteAgentModal: false, agentData: null }),
    sendAgentPayslip: async (e: React.FormEvent) => {

        const { setIsLoading, setOkMsg, setErr } = useGlobalStore.getState()

        try {
            e.preventDefault()
            setIsLoading(true);
            const { data } = await axios.post("/api/email/payslip/agent");
            if (data.ok) {
                setIsLoading(false);
                setOkMsg("Success");
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg);
            }
            alert("Something went wrong");
        }
    }

}))

export default useAdminAgentStore