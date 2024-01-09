'use client'
import CashoutModal from '@/components/supplier/CashoutModal'
import SupplierBalance from '@/components/supplier/SupplierBalance'
import SupplierHeader from '@/components/supplier/SupplierHeader'
import SupplierProfile from '@/components/supplier/SupplierProfile'
import useSupplierBalanceStore from '@/lib/state/supplier/supplierBalanceStore'
import React from 'react'

const Page = () => {

    const cashout = useSupplierBalanceStore(state => state.cashout)

    return (
        <>
            <SupplierHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <SupplierProfile />
                <SupplierBalance />
            </div>

            {cashout && <CashoutModal />}
        </>
    )
}

export default Page