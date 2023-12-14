import SupplierHeader from '@/components/supplier/SupplierHeader'
import SupplierInfo from '@/components/supplier/SupplierInfo'
import SupplierProfile from '@/components/supplier/SupplierProfile'
import React from 'react'

const Page = () => {
    return (
        <>
            <SupplierHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <SupplierProfile />
                <SupplierInfo />
            </div>
        </>
    )
}

export default Page