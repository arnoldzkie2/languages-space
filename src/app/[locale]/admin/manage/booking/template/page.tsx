'use client'
import SideNav from '@/components/super-admin/SideNav'
import Pagination from '@/components/super-admin/management/Pagination'
import CommentsTemplateHeader from '@/components/super-admin/management/booking/template/CommentsTemplateHeader'
import SearchBookingCommentsTemplate from '@/components/super-admin/management/booking/template/SearchBookingCommentsTemplate'
import TemplateTable from '@/components/super-admin/management/booking/template/TemplateTable'
import useGlobalStore from '@/lib/state/globalStore'
import useCommentTemplateStore from '@/lib/state/super-admin/commentTemplateStore'
import React, { ChangeEvent, useEffect, useState } from 'react'

const Test = () => {

    const { isSideNavOpen, itemsPerPage, currentPage } = useGlobalStore()

    const { setTotalTemplates, templates, totalTemplates, getAllTemplates, selectedTemplates } = useCommentTemplateStore()

    const [searchQuery, setSearchQuery] = useState({
        message: '',
        user: '',
        gender: '',
    })

    const filterTemplate = templates.filter((template) => {

        const searchMessage = searchQuery.message.toUpperCase();
        const searchUser = searchQuery.user.toUpperCase();
        const searchGender = searchQuery.gender.toUpperCase()

        return (
            (searchMessage === '' || template.message.toUpperCase().includes(searchMessage)) &&
            (searchUser === '' || template.user.toUpperCase().includes(searchUser)) &&
            (searchGender === '' || template.gender.toUpperCase() === searchGender)
        );
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentTemplates = filterTemplate.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filterTemplate.length / itemsPerPage)

    const handleSearch = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setSearchQuery(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        setTotalTemplates({
            selected: selectedTemplates.length.toString(),
            searched: filterTemplate.length.toString(),
            total: templates.length.toString()
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templates.length, filterTemplate.length, selectedTemplates.length]);

    useEffect(() => {
        getAllTemplates()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <CommentsTemplateHeader />

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='bg-card border rounded-md gap-5 py-4 px-6 flex shadow w-1/6'>

                        <SearchBookingCommentsTemplate
                            handleSearch={handleSearch}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />

                    </div>
                    <TemplateTable filteredTable={currentTemplates} />

                </div>

                <Pagination totals={totalTemplates} getTotalPages={getTotalPages} />

            </div>
        </div>
    )
}

export default Test