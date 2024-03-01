/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import SearchCard from '@/components/super-admin/management/card/SearchCard'
import ClientCardTable from '@/components/super-admin/management/client/card/ClientCardTable'
import { Link } from '@/lib/navigation'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore'
import { ClientCardProps } from '@/lib/types/super-admin/clientCardType'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const { clientCards, getClientCards } = useAdminClientCardStore()

    const { isSideNavOpen, currentPage, itemsPerPage } = useGlobalStore()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        validity: '',
        balance: '',
        price: '',
    })

    const filteredCard = clientCards.filter((card) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPrice = searchQuery.price.toUpperCase();
        const searchBalance = searchQuery.balance.toUpperCase();
        const searchValidity = searchQuery.validity.toUpperCase();

        return (

            (searchName === '' || card.name.toUpperCase().includes(searchName)) &&
            (searchPrice === '' || card.price.toString().toUpperCase().includes(searchPrice)) &&
            (searchBalance === '' || card.balance.toString().toUpperCase().includes(searchBalance)) &&
            (searchValidity === '' || card.validity.toUpperCase().includes(searchValidity))
        );
    }) as ClientCardProps[]

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCards = filteredCard?.slice(indexOfFirstItem, indexOfLastItem)

    const handleSearch = (e: any) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        getClientCards(params.clientID)
    }, [])

    const t = useTranslations()

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('client.manage')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                        {isAdminAllowed('create_client') && <Link href={'/admin/manage/client/new'} className='flex items-center justify-center w-28 hover:text-primary cursor-pointer'>
                            <div>{t('client.create')}</div>
                        </Link>}
                        {isAdminAllowed('view_client') && <Link href={'/admin/manage/client/'} className='flex items-center justify-center w-28 hover:text-primary cursor-pointer'>
                            <div>{t('client.manage')}</div>
                        </Link>}
                    </ul>
                </nav>                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-card w-1/6'>
                        <SearchCard handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <ClientCardTable filteredTable={currentCards} clientID={params.clientID} />
                </div>
            </div>
        </div>
    )
}

export default Page