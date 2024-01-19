/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import SearchSupplier from '@/components/super-admin/management/supplier/SearchSupplier';
import SupplierDeleteWarningModal from '@/components/super-admin/management/supplier/SupplierDeleteWarningModal';
import SupplierHeader from '@/components/super-admin/management/supplier/SupplierHeader';
import SupplierTable from '@/components/super-admin/management/supplier/SupplierTable';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminSupplierStore, { manageSupplierSearchQueryValue } from '@/lib/state/super-admin/supplierStore';
import React, { useEffect, useState } from 'react';

interface PageProps {
}

const Page: React.FC<PageProps> = ({ }) => {

    const { supplier, totalSupplier, selectedSupplier, deleteSupplierModal, getSupplier, setTotalSupplier } = useAdminSupplierStore()
    const { currentPage, departmentID, isSideNavOpen, setCurrentPage, itemsPerPage, setDepartmentID } = useGlobalStore()

    const [searchQuery, setSearchQuery] = useState(manageSupplierSearchQueryValue)

    const filteredSupplier = supplier.filter((supplier) => {

        const searchName = searchQuery.name.toUpperCase();
        const searchPhone = searchQuery.phone_number.toUpperCase();
        const searchOrganization = searchQuery.organization.toUpperCase();
        const searchOrigin = searchQuery.origin.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase()

        return (

            (searchName === '' || supplier.name.toUpperCase().includes(searchName)) &&
            (searchPhone === '' || supplier.phone_number?.toUpperCase().includes(searchPhone)) &&
            (searchOrganization === '' || supplier.organization?.toUpperCase().includes(searchOrganization)) &&
            (searchOrigin === '' || supplier.origin?.toUpperCase().includes(searchOrigin)) &&
            (searchNote === '' || supplier.note?.toUpperCase().includes(searchNote))

        );
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentSupplier = filteredSupplier.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredSupplier.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))

    }

    useEffect(() => {
        getSupplier()
        setCurrentPage(1)
    }, [departmentID])

    useEffect(() => {
        setDepartmentID('')
    }, [])

    useEffect(() => {

        setTotalSupplier({
            selected: selectedSupplier.length.toString(),
            searched: filteredSupplier.length.toString(),
            total: supplier.length.toString()
        })

    }, [supplier.length, filteredSupplier.length, selectedSupplier.length])

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <SupplierHeader />

                <div className='flex w-full items-start h-full gap-8 px-8'>
                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <Departments />
                        <SearchSupplier handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <SupplierTable filteredTable={currentSupplier} />

                </div>

                <Pagination getTotalPages={getTotalPages} totals={totalSupplier} />

            </div>

            {deleteSupplierModal && <SupplierDeleteWarningModal getSupplierByDepartments={getSupplier} />}
        </div>
    );
};

export default Page;
