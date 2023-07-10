import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import { setCurrentPage } from '@/lib/redux/GlobalState/GlobalSlice';
import { totalNewsState } from '@/lib/redux/ManageWeb/Types';
import { useTranslations } from 'next-intl';

interface Props {

    getTotalPages: () => number

    total: totalNewsState

}

const Pagination: React.FC<Props> = ({ total, getTotalPages }) => {

    const dispatch = useDispatch()

    const { currentPage } = useSelector((state: RootState) => state.globalState)

    const goToPreviousPage = () => {

        if (currentPage > 1) {

            dispatch(setCurrentPage(currentPage - 1));
        }

    }

    const goToNextPage = () => {

        const totalPages = getTotalPages();

        if (currentPage < totalPages) {

            dispatch(setCurrentPage(currentPage + 1));

        }
    }

    const goToPage = (pageNumber: number) => {

        const totalPages = getTotalPages();

        if (pageNumber >= 1 && pageNumber <= totalPages) {

            dispatch(setCurrentPage(pageNumber));

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

    const t = useTranslations('pagination')

    const globalT = useTranslations('global')

    return (
        <footer className={`flex py-5 px-10 items-center justify-between border shadow-md bg-white`}>
            <div className='flex items-center gap-3'>
                <div className='font-medium'>
                    {t('page')} {currentPage} of {getTotalPages()}
                </div>
                <input
                    type='text'
                    className='outline-none border px-3 py-2 w-1/3'
                    placeholder={t('goto')}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        dispatch(setCurrentPage(isNaN(value) ? 1 : value));
                    }}
                />
            </div>

            <div className='flex items-center gap-8'>
                {total.selected && <div className='font-medium'>{globalT('selected')} <span className='font-black text-gray-600'>{total.selected}</span></div>}
                <div className='font-medium'>{globalT('total')} <span className='font-black text-gray-600'>{total.total}</span></div>
            </div>

            <div className='flex gap-4 items-center'>{renderPageNumbers()}</div>

            <div className='flex items-center gap-5 h-full'>
                <button onClick={goToPreviousPage}
                    className={`w-32 border h-10 rounded-md ${currentPage !== 1 && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === 1}>
                    {t('prev')}
                </button>
                <button onClick={goToNextPage}
                    className={`w-32 border h-10 rounded-md ${currentPage !== getTotalPages() && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === getTotalPages()}>
                    {t('next')}
                </button>
            </div>

        </footer>
    );
};

export default Pagination;
