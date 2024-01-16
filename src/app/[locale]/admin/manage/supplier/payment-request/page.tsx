'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav'
import Pagination from '@/components/super-admin/management/Pagination'
import RequestPaymentsTable from '@/components/super-admin/management/supplier/balance/RequestPaymentsTable'
import SearchRequestPayments from '@/components/super-admin/management/supplier/balance/SearchRequestPayments'
import { Link } from '@/lib/navigation'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [searchQuery, setSearchQuery] = useState({
        amount: '',
        payment_address: '',
        status: ''
    })

    const { isSideNavOpen, setCurrentPage, currentPage, itemsPerPage, departmentID } = useGlobalStore()
    const { transactions, getTransactions, setTotalTransactions, totalTransactions } = useSupplierBalanceStore()
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

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")

    return (
        <div className='h-screen'>
            <AdminSideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('supplier.payment.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-4'>
                        {permissions?.create_supplier_earnings && <Link href='/admin/manage/supplier/earnings' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{tt('earnings')}</div>
                        </Link>}
                        {permissions?.create_supplier_deductions && <Link href='/admin/manage/supplier/deductions' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{tt('deductions')}</div>
                        </Link>}
                        {permissions?.view_supplier && <Link href='/admin/manage/supplier' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{t('supplier.h1')}</div>
                        </Link>}
                    </ul>
                </nav>

                <div className='flex w-full items-start h-full gap-8 px-8'>
                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
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