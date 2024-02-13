'use client'
import SideNav from '@/components/super-admin/SideNav'
import Pagination from '@/components/super-admin/management/Pagination'
import SearchAgentDeduction from '@/components/super-admin/management/agent/SearchAgentDeduction'
import useGlobalStore from '@/lib/state/globalStore'
import React, { useEffect, useState } from 'react'
import useSupplierEarningsStore from '@/lib/state/super-admin/supplierEarningStore'
import SupplierEarningsTable from '@/components/super-admin/management/supplier/SupplierEarningsTable'
import SupplierEarningsHeader from '@/components/super-admin/management/supplier/EarningsHeader'

interface Props {
    params: {
        supplierID: string
    }
}

const SupplierEarningsPage = ({ params }: Props) => {

    const { supplierID } = params
    const { supplierEarnings, getSupplierEarnings, totalEarnings, setTotalEarnings, selectedEarnings } = useSupplierEarningsStore()
    const { currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()

    const [searchQuery, setSearchQuery] = useState({
        name: '',
        amount: '',
        rate: '',
        quantity: '',
    })

    const filteredDeductions = supplierEarnings.filter((earnings) => {
        const searchName = searchQuery.name.toUpperCase();
        const searchAmount = searchQuery.amount.toUpperCase();
        const searchRate = searchQuery.rate.toUpperCase();
        const searchQuantity = searchQuery.quantity.toUpperCase();

        return (
            (searchName === '' || earnings.name.toUpperCase().includes(searchName)) &&
            (searchAmount === '' || String(Number(earnings.amount)).toUpperCase().includes(searchAmount)) &&
            (searchRate === '' || String(Number(earnings.rate)).toUpperCase().includes(searchRate)) &&
            (searchQuantity === '' || String(earnings.quantity).toUpperCase().includes(searchQuantity))
        )
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentEarnings = filteredDeductions.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredDeductions.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: type === 'checkbox' ? checked : value
        }))
    }

    useEffect(() => {
        getSupplierEarnings(supplierID)
        setCurrentPage(1)
        setSearchQuery({
            name: '',
            amount: '',
            rate: '',
            quantity: '',
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setTotalEarnings({
            selected: selectedEarnings.length.toString(),
            searched: filteredDeductions.length.toString(),
            total: supplierEarnings.length.toString()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplierEarnings.length, filteredDeductions.length, selectedEarnings.length])


    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <SupplierEarningsHeader />
                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-card w-1/6'>
                        <SearchAgentDeduction handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <SupplierEarningsTable filteredTable={currentEarnings} supplierID={supplierID} />
                </div>
                <Pagination getTotalPages={getTotalPages} totals={totalEarnings} />
            </div>
        </div>
    )

}

export default SupplierEarningsPage