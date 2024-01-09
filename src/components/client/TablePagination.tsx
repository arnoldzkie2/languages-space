'use client'
import useGlobalPaginationStore from '@/lib/state/globalPaginationStore'
import { useTranslations } from 'next-intl'
import React from 'react'

const TablePagination = ({ data }: { data: any[] }) => {

    const ttt = useTranslations('super-admin')

    const { currentPage, getTotalPages, setCurrentPage, goToPreviousPage, goToNextPage } = useGlobalPaginationStore()

    return (
        <footer className={`flex mt-auto min-h-[80px] items-center justify-between border-t text-xs lg:text-md`}>
            <div className='sm:flex items-center gap-3 w-44 lg:w-56 hidden'>
                <div className='font-medium'>
                    {ttt('pagination.page')} {currentPage} of {getTotalPages(data)}
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
                <div className='font-medium'>{ttt('global.total')} <span className='font-black text-gray-600'>{data && data.length}</span></div>
            </div>

            <div className='flex items-center gap-5 h-full'>
                <button onClick={goToPreviousPage}
                    className={`w-20 lg:w-32 border h-8 rounded-md ${currentPage !== 1 && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === 1}>
                    {ttt('pagination.prev')}
                </button>
                <button onClick={() => goToNextPage(data)}
                    className={`w-20 lg:w-32 border h-8 rounded-md ${currentPage !== getTotalPages(data) && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === getTotalPages(data)}>
                    {ttt('pagination.next')}
                </button>
            </div>

        </footer>
    )
}

export default TablePagination