/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav'
import AdminOrderTable from '@/components/admin/management/orders/AdminOrderTable'
import DownloadTable from '@/components/super-admin/management/DownloadTable'
import Pagination from '@/components/super-admin/management/Pagination'
import SearchOrder from '@/components/super-admin/management/order/SearchOrder'
import { Link } from '@/lib/navigation'
import useAdminPageStore from '@/lib/state/admin/adminPageStore'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminOrderStore, { ManageOrderSearchValue } from '@/lib/state/super-admin/orderStore'
import React, { useEffect, useState } from 'react'
import { useTranslations } from 'use-intl'

const Page = () => {

    const [searchQuery, setSearchQuery] = useState(ManageOrderSearchValue)

    const { departmentID, currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()
    const { getOrders, setTotalOrders, selectedOrder, orders, totalOrders } = useAdminOrderStore()
    const permissions = useAdminPageStore(s => s.permissions)
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const filteredOrders = orders.filter((order) => {
        const searchCard = searchQuery.card.toUpperCase();
        const searchClient = searchQuery.client_name.toUpperCase();
        const searchQuantity = searchQuery.quantity.toUpperCase();
        const searchPrice = searchQuery.price.toUpperCase();
        const searchNote = searchQuery.note.toUpperCase()
        const searchOperator = searchQuery.operator.toUpperCase()
        const searchStatus = searchQuery.status.toUpperCase()
        const searchInvoice = searchQuery.invoice_number.toUpperCase()
        const searchExpress = searchQuery.express_number.toUpperCase()
        const searchDate = searchQuery.date.toUpperCase()
        return (
            (searchCard === '' || order.card.name.toUpperCase().includes(searchCard)) &&
            (searchClient === '' || order.client.name.toUpperCase().includes(searchClient)) &&
            (searchQuantity === '' || String(order.quantity).toUpperCase().includes(searchQuantity)) &&
            (searchPrice === '' || String(order.price).toUpperCase().includes(searchPrice)) &&
            (searchOperator === '' || order.operator.toUpperCase().includes(searchOperator)) &&
            (searchStatus === '' || order.status.toUpperCase().includes(searchStatus)) &&
            (searchInvoice === '' || order.invoice_number?.toUpperCase().includes(searchInvoice)) &&
            (searchExpress === '' || order.express_number?.toUpperCase().includes(searchExpress)) &&
            (searchDate === '' || order.created_at?.toUpperCase().includes(searchDate)) &&
            (searchNote === '' || order.note?.toUpperCase().includes(searchNote))
        );
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
    const getTotalPages = () => Math.ceil(filteredOrders.length / itemsPerPage)

    useEffect(() => {
        getOrders()
        setCurrentPage(1)
        setSearchQuery(ManageOrderSearchValue)
    }, [departmentID])

    useEffect(() => {
        setTotalOrders({
            selected: selectedOrder.length.toString(),
            searched: filteredOrders.length.toString(),
            total: orders.length.toString()

        })
    }, [orders.length, filteredOrders.length, selectedOrder.length])

    const t = useTranslations('super-admin')
    return (
        <div className='h-screen'>

            <AdminSideNav />

            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b px-8 flex items-center min-h-[64px] justify-between bg-white`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('order.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {permissions?.create_orders &&
                            <Link href={'/admin/manage/orders/new'} className='flex items-center text-gray-600 justify-center w-28 hover:text-blue-600 cursor-pointer'>
                                <div>{t('order.create')}</div>
                            </Link>}
                        {permissions?.download_table && <DownloadTable tables={orders} selectedTable={selectedOrder} />}
                    </ul>
                </nav>                <div className='px-8'>
                    <div className='border py-4 gap-5 px-8 flex shadow bg-white w-full items-center'>
                        <SearchOrder handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                </div>
                <div className='flex w-full items-start gap-8 px-8'>
                    <AdminOrderTable filteredTable={currentOrders} />
                </div>

                <Pagination totals={totalOrders} getTotalPages={getTotalPages} />

            </div>

        </div>)
}

export default Page