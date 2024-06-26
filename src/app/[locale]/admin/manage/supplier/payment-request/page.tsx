'use client'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import Pagination from '@/components/super-admin/management/Pagination'
import RequestPaymentsHeader from '@/components/super-admin/management/supplier/balance/RequestPaymentsHeader'
import RequestPaymentsTable from '@/components/super-admin/management/supplier/balance/RequestPaymentsTable'
import SearchRequestPayments from '@/components/super-admin/management/supplier/balance/SearchRequestPayments'
import { Link } from '@/lib/navigation'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [searchQuery, setSearchQuery] = useState({
        amount: '',
        payment_address: '',
        status: ''
    })
    const { departmentID, setDepartmentID } = useDepartmentStore()
    const { isSideNavOpen, setCurrentPage, currentPage, itemsPerPage, } = useGlobalStore()
    const { transactions, getTransactions, totalTransactions, setTotalTransactions } = useSupplierBalanceStore()
    const permissions = useAdminPageStore(s => s.permissions)

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


    useEffect(() => {

        setTotalTransactions({
            selected: '0',
            searched: filteredTransactions.length.toString(),
            total: transactions?.length.toString() || '0'
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions?.length, filteredTransactions.length])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <RequestPaymentsHeader />
                <div className='flex w-full items-start h-full gap-8 px-8'>
                    <div className='border py-3 px-6 flex flex-col shadow bg-card w-1/6'>
                        <Departments />
                        <SearchRequestPayments handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <RequestPaymentsTable filteredTable={currentTransactions} />

                </div>

                <Pagination getTotalPages={getTotalPages} totals={totalTransactions} />

            </div>

        </div>
    )
}

export default Page