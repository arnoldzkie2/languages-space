/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import Pagination from '@/components/super-admin/management/Pagination'
import AgentHeader from '@/components/super-admin/management/booking/agent/AgentHeader'
import AgentTable from '@/components/super-admin/management/booking/agent/AgentTable'
import SearchAgent from '@/components/super-admin/management/booking/agent/SearchAgent'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminAgentStore, { ManageAgentSearchQueryValue } from '@/lib/state/super-admin/agentStore'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const { departmentID, currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()
    const { agents, selectedAgents, getAgents, setTotalAgent, totalAgent } = useAdminAgentStore()

    const [searchQuery, setSearchQuery] = useState(ManageAgentSearchQueryValue)

    const filteredAgents = agents.filter((agent) => {
        const searchName = searchQuery.name.toUpperCase();
        const searchPhone = searchQuery.phone_number.toUpperCase();
        const searchOrganization = searchQuery.organization.toUpperCase();
        const searchOrigin = searchQuery.origin.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase();
        return (
            (searchName === '' || agent.name?.toUpperCase().includes(searchName)) &&
            (searchPhone === '' || agent.phone_number?.toUpperCase().includes(searchPhone)) &&
            (searchOrganization === '' || agent.organization?.toUpperCase().includes(searchOrganization)) &&
            (searchOrigin === '' || agent.origin?.toUpperCase().includes(searchOrigin)) &&
            (searchNote === '' || agent.note?.toUpperCase().includes(searchNote))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredAgents.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: type === 'checkbox' ? checked : value
        }))
    }

    useEffect(() => {
        getAgents()
        setCurrentPage(1)
        setSearchQuery(ManageAgentSearchQueryValue)
    }, [departmentID])

    useEffect(() => {
        setTotalAgent({
            selected: selectedAgents.length.toString(),
            searched: filteredAgents.length.toString(),
            total: agents.length.toString()
        })

    }, [agents.length, filteredAgents.length, selectedAgents.length])

    return (
        <div className='h-screen'>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <AgentHeader />

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <Departments />
                        <SearchAgent handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <AgentTable filteredTable={currentAgents} />

                </div>

                <Pagination totals={totalAgent} getTotalPages={getTotalPages} />
            </div>
        </div>
    )
}

export default Page