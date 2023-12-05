/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import useClientStore from '@/lib/state/client/clientStore'


const ClientOrders: React.FC = () => {

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    const { setPage, orders, getClientOrders } = useClientStore()

    const { skeleton, currentPage, setCurrentPage, itemsPerPage } = useAdminGlobalStore()
    const getTotalPages = () => {
        if (orders) {
            return Math.ceil(orders.length / itemsPerPage)
        } else return 1
    }

    const goToPreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(currentPage - 1);
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentOrders = orders && orders.slice(indexOfFirstItem, indexOfLastItem)


    const goToNextPage = () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    useEffect(() => {
        if (!orders) {
            getClientOrders()
        }
        setPage('orders')
    }, [])

    return (
        <ul className='flex flex-col gap-3 w-full md:w-2/3 xl:w-1/2 order-1 md:order-2'>
            <h1 className='text-blue-600 border-b mb-1 pb-1 text-lg font-bold'>{t('profile.my-orders')}</h1>
            <div className='overflow-x-auto'>
                <table className="text-sm text-left text-gray-800 shadow-md w-full">
                    <thead className="text-xs uppercase bg-slate-100 border">
                        <tr>
                            <th scope="col" className="px-3 py-3">{tt('card')}</th>
                            <th scope="col" className="px-3 py-3">{tt('quantity')}</th>
                            <th scope="col" className="px-3 py-3">{tt('price')}</th>
                            <th scope="col" className="px-3 py-3">{tt('status')}</th>
                            <th scope="col" className="px-3 py-3">{tt('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders && currentOrders.length > 0 ?
                            currentOrders.map(order => (
                                <tr className="bg-white border hover:bg-slate-50" key={order.id}>
                                    <td className='px-3 py-3'>
                                        <div className='h-5 text-xs md:text-sm w-36'>
                                            {order.card.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-8'>
                                            {order.quantity}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-16'>
                                            ¥{order.price}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs md:text-sm w-10 uppercase'>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className='h-5 text-xs w-44 md:text-sm'>
                                            {new Date(order.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            )) :
                            skeleton.map(item => (
                                <tr key={item}>

                                    <td className='py-3.5 px-3'>
                                        <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                                    </td>
                                    <td className='py-3.5 px-3'>
                                        <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                                    </td>
                                    <td className='py-3.5 px-3'>
                                        <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                                    </td>
                                    <td className='py-3.5 px-3'>
                                        <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                                    </td>
                                    <td className='py-3.5 px-3'>
                                        <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody >
                </table >
            </div>
            <footer className={`flex mt-auto min-h-[80px] items-center justify-between border-t text-xs lg:text-md`}>
                <div className='hidden sm:flex items-center gap-3 w-44 lg:w-56'>
                    <div className='font-medium'>
                        {ttt('pagination.page')} {currentPage} of {getTotalPages()}
                    </div>
                    <input
                        type='text'
                        className='outline-none border px-3 py-1 w-1/3 lg:w-2/5'
                        placeholder={ttt('pagination.goto')}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setCurrentPage(isNaN(value) ? 1 : value);
                        }}
                    />
                </div>

                <div className='flex items-center mr-auto'>
                    <div className='font-medium'>{ttt('global.total')} <span className='font-black text-gray-600'>{orders && orders.length}</span></div>
                </div>

                <div className='flex items-center gap-5 h-full'>
                    <button onClick={goToPreviousPage}
                        className={`w-20 lg:w-32 border h-8 rounded-md ${currentPage !== 1 && 'hover:bg-blue-600 hover:text-white'}`}
                        disabled={currentPage === 1}>
                        {ttt('pagination.prev')}
                    </button>
                    <button onClick={goToNextPage}
                        className={`w-20 lg:w-32 border h-8 rounded-md ${currentPage !== getTotalPages() && 'hover:bg-blue-600 hover:text-white'}`}
                        disabled={currentPage === getTotalPages()}>
                        {ttt('pagination.next')}
                    </button>
                </div>

            </footer>
        </ul>
    )
}

export default ClientOrders