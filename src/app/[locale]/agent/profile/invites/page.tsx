'use client'
import AgentHeader from '@/components/agent/AgentHeader'
import AgentInvites from '@/components/agent/AgentInvites'
import AgentProfile from '@/components/agent/AgentProfile'
import React from 'react'

const Page = () => {

    return (
        <>
            <AgentHeader />
            <div className='px-5 md:flex-row lg:justify-center sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <AgentProfile />
                <AgentInvites />
            </div>
        </>
    )
}

export default Page