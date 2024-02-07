import { Department } from '@prisma/client'
import axios from 'axios'
import { Session } from 'next-auth'
import { create } from 'zustand'

interface AgentStoreProps {
    agent: Session['user'] | null
    setAgent: (agent: Session['user']) => void
    agentDepartment: Department[] | null
    getAgentDepartment: () => Promise<void>
}

const useAgentStore = create<AgentStoreProps>((set) => ({
    agent: null,
    setAgent: (agent: Session['user']) => set({ agent }),
    agentDepartment: null,
    getAgentDepartment: async () => {
        try {

            const { data } = await axios.get("/api/agent/department")
            if (data.ok) set({ agentDepartment: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong (get agent department)")
        }
    }
}))

export default useAgentStore