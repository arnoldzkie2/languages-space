'use client'
import SideNav from '@/components/super-admin/SideNav'
import Pagination from '@/components/super-admin/management/Pagination'
import SearchAgentDeduction from '@/components/super-admin/management/agent/SearchAgentDeduction'
import useGlobalStore from '@/lib/state/globalStore'
import React, { useEffect, useState } from 'react'
import useSupplierDeductionStore from '@/lib/state/super-admin/supplierDeductionStore'
import SupplierDeductionsTable from '@/components/super-admin/management/supplier/SupplierDeductionTable'
import SupplierDeductionHeader from '@/components/super-admin/management/supplier/DeductionsHeader'

interface Props {
    params: {
        supplierID: string
    }
}

const AgentDeductionPage = ({ params }: Props) => {

    const { supplierID } = params
    const { supplierDeductions, getSupplierDeductions, totalDeductions, setTotalDeductions, selectedDeductions } = useSupplierDeductionStore()
    const { currentPage, setCurrentPage, isSideNavOpen, itemsPerPage } = useGlobalStore()

    const [searchQuery, setSearchQuery] = useState({
        name: '',
        amount: '',
        rate: '',
        quantity: '',
    })

    const filteredDeductions = supplierDeductions.filter((deduction) => {
        const searchName = searchQuery.name.toUpperCase();
        const searchAmount = searchQuery.amount.toUpperCase();
        const searchRate = searchQuery.rate.toUpperCase();
        const searchQuantity = searchQuery.quantity.toUpperCase();

        return (
            (searchName === '' || deduction.name.toUpperCase().includes(searchName)) &&
            (searchAmount === '' || String(Number(deduction.amount)).toUpperCase().includes(searchAmount)) &&
            (searchRate === '' || String(Number(deduction.rate)).toUpperCase().includes(searchRate)) &&
            (searchQuantity === '' || String(deduction.quantity).toUpperCase().includes(searchQuantity))
        )
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentDeductions = filteredDeductions.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredDeductions.length / itemsPerPage)

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        setCurrentPage(1)
        setSearchQuery(prevState => ({
            ...prevState, [name]: type === 'checkbox' ? checked : value
        }))
    }

    useEffect(() => {
        getSupplierDeductions(supplierID)
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
        setTotalDeductions({
            selected: selectedDeductions.length.toString(),
            searched: filteredDeductions.length.toString(),
            total: supplierDeductions.length.toString()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplierDeductions.length, filteredDeductions.length, selectedDeductions.length])

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <SupplierDeductionHeader />
                <div className='flex w-full items-start gap-8 px-8'>
                    <div className='border py-4 px-6 flex flex-col shadow bg-card w-1/6'>
                        <SearchAgentDeduction handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>
                    <SupplierDeductionsTable filteredTable={currentDeductions} supplierID={supplierID} />
                </div>
                <Pagination getTotalPages={getTotalPages} totals={totalDeductions} />
            </div>
        </div>
    )

}

export default AgentDeductionPage