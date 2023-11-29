import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';

interface Props {

    getTotalPages: () => number

    totals: {
        total: string
        selected: string
        searched: string
    }

}

const Pagination: React.FC<Props> = ({ totals, getTotalPages }) => {

    const { currentPage, setCurrentPage } = useAdminGlobalStore()

    const goToPreviousPage = () => {

        if (currentPage > 1) {

            setCurrentPage(currentPage - 1);
        }

    }

    const goToNextPage = () => {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const goToPage = (pageNumber: number) => {
        const totalPages = getTotalPages();
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    const renderPageNumbers = () => {

        const totalPages = getTotalPages();
        const range = 2;

        let start = Math.max(1, currentPage - range);
        let end = Math.min(totalPages, currentPage + range);

        const pageNumbers = [];

        if (start > 1) {
            pageNumbers.push(<div key={1} className="cursor-pointer text-lg hover:bg-blue-600 px-2 hover:text-white" onClick={() => goToPage(1)}>1</div>);

            if (start > 2) {
                pageNumbers.push(<div key="ellipsis-prev" className="text-lg"><FontAwesomeIcon icon={faEllipsis} /></div>);

            }
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(<div key={i}
                className={`${i === currentPage && 'text-white bg-blue-600 px-2'} cursor-pointer text-lg hover:text-white hover:bg-blue-600 px-2`}
                onClick={() => goToPage(i)}>{i}</div>);

        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pageNumbers.push(<div key="ellipsis-next" className="pagination-ellipsis"><FontAwesomeIcon icon={faEllipsis} /></div>);

            }
            pageNumbers.push(<div key={totalPages} className="text-lg hover:text-white cursor-pointer hover:bg-blue-600 px-2" onClick={() => goToPage(totalPages)}>{totalPages}</div>);

        }
        return pageNumbers;

    };

    const t = useTranslations('super-admin')

    return (
        <footer className={`flex px-8 mt-auto min-h-[80px] items-center justify-between border-t bg-white`}>
            <div className='flex items-center gap-3'>
                <div className='font-medium'>
                    {t('pagination.page')} {currentPage} of {getTotalPages()}
                </div>
                <input
                    type='text'
                    className='outline-none border px-3 py-2 w-1/3'
                    placeholder={t('pagination.goto')}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setCurrentPage(isNaN(value) ? 1 : value);
                    }}
                />
            </div>

            <div className='flex items-center gap-10'>
                <div className='font-medium'>{t('global.result')} <span className='font-black text-gray-600'>{totals.searched === totals.total ? '' : totals.searched}</span></div>
                <div className='font-medium'>{t('global.selected')} <span className='font-black text-gray-600'>{totals.selected === '0' ? '' : totals.selected}</span></div>
                <div className='font-medium'>{t('global.total')} <span className='font-black text-gray-600'>{totals.total}</span></div>
            </div>

            <div className='flex gap-4 items-center'>{renderPageNumbers()}</div>

            <div className='flex items-center gap-5 h-full'>
                <button onClick={goToPreviousPage}
                    className={`w-32 border h-10 rounded-md ${currentPage !== 1 && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === 1}>
                    {t('pagination.prev')}
                </button>
                <button onClick={goToNextPage}
                    className={`w-32 border h-10 rounded-md ${currentPage !== getTotalPages() && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === getTotalPages()}>
                    {t('pagination.next')}
                </button>
            </div>

        </footer>
    );
};

export default Pagination;
