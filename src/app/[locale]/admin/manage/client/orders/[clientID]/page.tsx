/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import Pagination from '@/components/super-admin/management/Pagination'
import ClientHeader from '@/components/super-admin/management/client/ClientHeader'
import ClientOrderTable from '@/components/super-admin/management/client/orders/ClientOrdersTable'
import OrderHeader from '@/components/super-admin/management/order/OrderHeader'
import OrderTable from '@/components/super-admin/management/order/OrderTable'
import SearchOrder from '@/components/super-admin/management/order/SearchOrder'
import useGlobalStore from '@/lib/state/globalStore'
import useClientOrderStore from '@/lib/state/super-admin/ClientOrdersStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { ManageOrderSearchValue } from '@/lib/state/super-admin/orderStore'
import React, { useEffect, useState } from 'react'

interface Props {
    params: {
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const clientID = params.clientID
    const [searchQuery, setSearchQuery] = useState(ManageOrderSearchValue)
    const departmentID = useDepartmentStore(s => s.departmentID)
    const { currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()
    const { getClientOrders, setTotalClientOrders, selectedClientOrders, clientOrders, totalClientOrders } = useClientOrderStore()

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const filteredOrders = clientOrders.filter((order) => {
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
            (searchCard === '' || order.card_name.toUpperCase().includes(searchCard)) &&
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
        getClientOrders(clientID)
        setCurrentPage(1)
        setSearchQuery(ManageOrderSearchValue)
    }, [departmentID])

    useEffect(() => {
        setTotalClientOrders({
            selected: selectedClientOrders.length.toString(),
            searched: filteredOrders.length.toString(),
            total: clientOrders.length.toString()

        })
    }, [clientOrders.length, filteredOrders.length, selectedClientOrders.length])

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <ClientHeader />
                <div className='px-8'>
                    <div className='border py-4 gap-5 px-8 flex shadow bg-card w-full items-center'>
                        <SearchOrder handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                </div>
                <div className='flex w-full items-start gap-8 px-8'>
                    <ClientOrderTable filteredTable={currentOrders} clientID={clientID} />
                </div>
                <Pagination totals={totalClientOrders} getTotalPages={getTotalPages} />
            </div>
        </div>)
}

export default Page