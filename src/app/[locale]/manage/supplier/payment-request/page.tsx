'use client'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import RequestPaymentsHeader from '@/components/super-admin/management/supplier/balance/RequestPaymentsHeader'
import RequestPaymentsTable from '@/components/super-admin/management/supplier/balance/RequestPaymentsTable'
import SearchRequestPayments from '@/components/super-admin/management/supplier/balance/SearchRequestPayments'
import useGlobalStore from '@/lib/state/globalStore'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [searchQuery, setSearchQuery] = useState({
        amount: '',
        payment_address: '',
        status: ''
    })

    const { isSideNavOpen, setCurrentPage, currentPage, itemsPerPage, departmentID, setDepartmentID } = useGlobalStore()
    const { transactions, getTransactions } = useSupplierBalanceStore()

    const filteredTransactions = transactions && transactions.filter((obj) => {

        const searchAmount = searchQuery.amount.toUpperCase();
        const searchPaymentInfo = searchQuery.payment_address.toUpperCase()
        const searchStatus = searchQuery.status.toUpperCase()

        return (

            (searchAmount === '' || obj.amount?.toString().toUpperCase().includes(searchAmount)) &&
            (searchPaymentInfo === '' || obj.payment_address?.toUpperCase().includes(searchPaymentInfo)) &&
            (searchStatus === '' || obj.status.toUpperCase().includes(searchStatus))

        )
    }) || []

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredTransactions.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {

        const { name, value } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))

    }

    useEffect(() => {
        setDepartmentID('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getTransactions()
        setCurrentPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <RequestPaymentsHeader />

                <div className='flex w-full items-start h-full gap-8 px-8'>
                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <Departments />
                        <SearchRequestPayments handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <RequestPaymentsTable filteredTable={currentTransactions} />

                </div>

                {/* <Pagination getTotalPages={getTotalPages} totals={totalSupplier} /> */}

            </div>

            {/* {deleteSupplierModal && <SupplierDeleteWarningModal getSupplierByDepartments={getSupplier} />} */}
        </div>
    )
}

export default Page