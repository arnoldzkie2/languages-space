/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import Pagination from '@/components/super-admin/management/Pagination'
import AdminHeader from '@/components/super-admin/management/admin/AdminHeader'
import AdminTable from '@/components/super-admin/management/admin/AdminTable'
import DeleteAdminModal from '@/components/super-admin/management/admin/DeleteAdminModal'
import SearchAdmin from '@/components/super-admin/management/admin/SearchAdmin'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminStore, { adminSearchQueryValue } from '@/lib/state/super-admin/adminStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const { currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()
    const { admins, selectedAdmins, getAdmins, setTotalAdmin, totalAdmin, deleteAdminModal } = useAdminStore()
    const departmentID = useDepartmentStore(s => s.departmentID)
    const [searchQuery, setSearchQuery] = useState(adminSearchQueryValue)

    const filteredAgents = admins.filter((agent) => {
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
        getAdmins()
        setCurrentPage(1)
        setSearchQuery(adminSearchQueryValue)
    }, [departmentID])

    useEffect(() => {
        setTotalAdmin({
            selected: selectedAdmins.length.toString(),
            searched: filteredAgents.length.toString(),
            total: admins.length.toString()
        })
    }, [admins.length, filteredAgents.length, selectedAdmins.length])

    return (
        <div className='h-screen'>
            <SideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <AdminHeader />

                <div className='flex w-full items-start gap-8 px-8'>

                    <div className='border py-4 px-6 flex flex-col shadow bg-card w-1/6'>
                        <Departments />
                        <SearchAdmin handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <AdminTable filteredTable={currentAgents} />

                </div>

                <Pagination totals={totalAdmin} getTotalPages={getTotalPages} />
            </div>
            {deleteAdminModal && <DeleteAdminModal />}
        </div>
    )
}

export default Page