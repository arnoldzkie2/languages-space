'use client'
import SideNav from '@/components/super-admin/SideNav'
import Pagination from '@/components/super-admin/management/Pagination'
import useGlobalStore from '@/lib/state/globalStore'
import React, { useEffect, useState } from 'react'
import { ManageClientSearchQueryValue } from '@/lib/state/super-admin/clientStore'
import SearchClient from '@/components/super-admin/management/client/SearchClient'
import AgentInvitesTable from '@/components/super-admin/management/agent/AgentInvites'
import useAgentInviteStore from '@/lib/state/super-admin/AgentInviteStore'
import { Link } from '@/lib/navigation'
import { useTranslations } from 'next-intl'

interface Props {
    params: {
        agentID: string
    }
}

const AgentDeductionPage = ({ params }: Props) => {

    const { agentID } = params
    const { agentInvites, getAgentInvites, totalInvites, setTotalInvites, selectedInvites } = useAgentInviteStore()
    const { currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()

    const [searchQuery, setSearchQuery] = useState(ManageClientSearchQueryValue)

    const filteredInvites = agentInvites.filter((client) => {
        const searchUsername = searchQuery.username.toUpperCase();
        const searchPhone = searchQuery.phone_number.toUpperCase();
        const searchOrganization = searchQuery.organization.toUpperCase();
        const searchOrigin = searchQuery.origin.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase();
        const filterCard = searchQuery.cards;

        if (filterCard) {
            // If filterCard is true, filter based on client.cards.length
            if (client.cards) {
                return (
                    (searchUsername === '' || client.username.toUpperCase().includes(searchUsername)) &&
                    (searchPhone === '' || client.phone_number?.toUpperCase().includes(searchPhone)) &&
                    (searchOrganization === '' || client.organization?.toUpperCase().includes(searchOrganization)) &&
                    (searchOrigin === '' || client.origin?.toUpperCase().includes(searchOrigin)) &&
                    (searchNote === '' || client.note?.toUpperCase().includes(searchNote))
                );
            }
        } else {
            // If filterCard is false, apply other filters without checking client.cards.length
            return (
                (searchUsername === '' || client.username.toUpperCase().includes(searchUsername)) &&
                (searchPhone === '' || client.phone_number?.toUpperCase().includes(searchPhone)) &&
                (searchOrganization === '' || client.organization?.toUpperCase().includes(searchOrganization)) &&
                (searchOrigin === '' || client.origin?.toUpperCase().includes(searchOrigin)) &&
                (searchNote === '' || client.note?.toUpperCase().includes(searchNote))
            );
        }
    });

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentInvites = filteredInvites.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredInvites.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: type === 'checkbox' ? checked : value
        }))
    }

    useEffect(() => {
        getAgentInvites(agentID)
        setCurrentPage(1)
        setSearchQuery(ManageClientSearchQueryValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setTotalInvites({
            selected: selectedInvites.length.toString(),
            searched: filteredInvites.length.toString(),
            total: agentInvites.length.toString()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentInvites.length, filteredInvites.length, selectedInvites.length])

    const t = useTranslations("super-admin")

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
                    <h1 className='font-black  text-xl uppercase'>{t('agent.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-4 text-muted-foreground'>
                        <Link href='/admin/manage/agent' className='flex items-center justify-center w-40  hover:-primary cursor-pointer gap-1 hover:text-primary'>
                            <div>{t('agent.h1')}</div>
                        </Link>
                    </ul>
                </nav>
                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-card w-1/6'>
                        <SearchClient setSearchQuery={setSearchQuery} searchQuery={searchQuery} handleSearch={handleSearch} />
                    </div>
                    <AgentInvitesTable filteredTable={currentInvites} />
                </div>
                <Pagination getTotalPages={getTotalPages} totals={totalInvites} />
            </div>
        </div>
    )

}

export default AgentDeductionPage