'use client'
import AgentBalance from '@/components/agent/AgentBalance'
import AgentCashoutModal from '@/components/agent/AgentCashoutModal'
import AgentHeader from '@/components/agent/AgentHeader'
import AgentProfile from '@/components/agent/AgentProfile'
import useAgentBalanceStore from '@/lib/state/agent/agentBalanceStore'
import React from 'react'

const Page = () => {

    const cashout = useAgentBalanceStore(state => state.cashout)

    return (
        <>
            <AgentHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <AgentProfile />
                <AgentBalance />
            </div>

            {cashout && <AgentCashoutModal />}
        </>
    )
}

export default Page