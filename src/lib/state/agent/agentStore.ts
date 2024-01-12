import { Session } from 'next-auth'
import { create } from 'zustand'

interface AgentStoreProps {
    agent: Session['user'] | null
    setAgent: (agent: Session['user']) => void
}

const useAgentStore = create<AgentStoreProps>((set) => ({
    agent: null,
    setAgent: (agent: Session['user']) => set({ agent })
}))

export default useAgentStore