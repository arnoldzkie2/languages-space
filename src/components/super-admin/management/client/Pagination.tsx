import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {

    goToPreviousPage: () => void

    currentPage: number

    goToNextPage: () => void

    getTotalPages: () => number

    setCurrentPage: Dispatch<SetStateAction<number>>

    goToPage: (pageNumber: number) => void

    totalClients: {
        total: string;
        searched: string;
        selected: string;
    }

}

const Pagination: React.FC<Props> = ({ goToPreviousPage, currentPage, goToNextPage, getTotalPages, setCurrentPage, goToPage, totalClients }) => {

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

    return (
        <div className={`flex py-5 px-10 items-center justify-between border shadow-md bg-white h-24`}>

            <div className='flex items-center gap-3 w-1/6'>
                <div className='font-medium'>
                    Page {currentPage} of {getTotalPages()}
                </div>
                <input
                    type='text'
                    className='outline-none border px-3 py-2 w-1/2'
                    placeholder='Go to page #'
                    value={currentPage === 1 ? '' : currentPage}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setCurrentPage(isNaN(value) ? 1 : value);
                    }}
                />
            </div>

            <div className='flex items-center gap-10'>
                <div className='font-medium'>Selected: <span className='font-black text-gray-600'>{totalClients.selected}</span></div>
                <div className='font-medium'>Search Result: <span className='font-black text-gray-600'>{totalClients.searched}</span></div>
            </div>

            <div className='flex gap-4 items-center'>{renderPageNumbers()}</div>

            <div className='flex items-center gap-5 h-full'>
                <button onClick={goToPreviousPage}
                    className={`w-32 border h-10 rounded-md ${currentPage !== 1 && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === 1}>
                    Prev Page
                </button>
                <button onClick={goToNextPage}
                    className={`w-32 border h-10 rounded-md ${currentPage !== getTotalPages() && 'hover:bg-blue-600 hover:text-white'}`}
                    disabled={currentPage === getTotalPages()}>
                    Next Page
                </button>
            </div>

        </div>
    );
};

export default Pagination;
