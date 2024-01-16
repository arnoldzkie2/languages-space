/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav'
import AdminAgentTable from '@/components/admin/management/agent/AdminAgentTable'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import DownloadTable from '@/components/super-admin/management/DownloadTable'
import Pagination from '@/components/super-admin/management/Pagination'
import AgentHeader from '@/components/super-admin/management/agent/AgentHeader'
import AgentTable from '@/components/super-admin/management/agent/AgentTable'
import DeleteAgentModal from '@/components/super-admin/management/agent/DeleteAgentModal'
import SearchAgent from '@/components/super-admin/management/agent/SearchAgent'
import { Link } from '@/lib/navigation'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminAgentStore, { agentSearchQueryValue } from '@/lib/state/super-admin/agentStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const { departmentID, currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()
    const { agents, selectedAgents, getAgents, setTotalAgent, totalAgent, deleteAgentModal } = useAdminAgentStore()

    const [searchQuery, setSearchQuery] = useState(agentSearchQueryValue)
    const permissions = useAdminPageStore(s => s.permissions)
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
        setSearchQuery(agentSearchQueryValue)
    }, [departmentID])

    useEffect(() => {
        setTotalAgent({
            selected: selectedAgents.length.toString(),
            searched: filteredAgents.length.toString(),
            total: agents.length.toString()
        })
    }, [agents.length, filteredAgents.length, selectedAgents.length])

    const t = useTranslations('super-admin')
    const tt = useTranslations("global")
    return (
        <div className='h-screen'>

            <AdminSideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('agent.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {permissions?.create_agent &&
                            <Link href={'/admin/manage/agent/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('agent.create')}</div>
                            </Link>}
                        {permissions?.create_agent_earnings && <Link href='/admin/manage/agent/earnings' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{tt('earnings')}</div>
                        </Link>}
                        {permissions?.create_agent_deductions && <Link href='/admin/manage/agent/deductions' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{tt('deductions')}</div>
                        </Link>}
                        {permissions?.download_table &&
                            <DownloadTable tables={agents} selectedTable={selectedAgents} />
                        }
                    </ul>
                </nav>

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='border py-4 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchAgent handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <AdminAgentTable filteredTable={currentAgents} />

                </div>

                <Pagination totals={totalAgent} getTotalPages={getTotalPages} />
            </div>
            {deleteAgentModal && <DeleteAgentModal />}
        </div>
    )
}

export default Page