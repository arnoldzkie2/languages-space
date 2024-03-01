import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
    getTotalPages: () => number
    totals: {
        total: string
        selected: string
        searched: string
    }
}

const Pagination: React.FC<Props> = ({ totals, getTotalPages }) => {

    const { currentPage, setCurrentPage } = useGlobalStore()

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
            pageNumbers.push(<Button variant={'outline'} key={1} className="hover:bg-primary px-2 hover:text-white" onClick={() => goToPage(1)}>1</Button>);

            if (start > 2) {
                pageNumbers.push(<div key="ellipsis-prev"><FontAwesomeIcon icon={faEllipsis} /></div>);

            }
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(<Button key={i}
                variant={i === currentPage ? 'default' : 'outline'}
                className='px-2.5 hover:bg-primary hover:text-secondary'
                onClick={() => goToPage(i)}>{i}</Button>);

        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pageNumbers.push(<div key="ellipsis-next" className="pagination-ellipsis"><FontAwesomeIcon icon={faEllipsis} /></div>);

            }
            pageNumbers.push(<Button variant={'outline'} key={totalPages} className="cursor-pointer px-2 hover:bg-primary hover:text-white" onClick={() => goToPage(totalPages)}>{totalPages}</Button>);

        }
        return pageNumbers;

    }

    const t = useTranslations()

    return (
        <footer className={`flex px-8 mt-auto min-h-[80px] items-center justify-between border-t text-muted-foreground`}>
            <div className='flex items-center gap-3'>
                <div className='font-medium'>
                    {t('pagination.page.h1')} {currentPage} of {getTotalPages()}
                </div>
                <Input
                    type='text'
                    className='outline-none border px-3 py-2 w-1/3'
                    placeholder={t('pagination.page.go_to')}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setCurrentPage(isNaN(value) ? 1 : value);
                    }}
                />
            </div>
            <div className='flex items-center gap-10'>
                <div className='flex items-center gap-2'>{t('pagination.result')} <span className='font-black'>{totals.searched === totals.total ? '' : totals.searched}</span></div>
                <div className='flex items-center gap-2'>{t('pagination.selected')} <span className='font-black'>{totals.selected === '0' ? '' : totals.selected}</span></div>
                <div className='flex items-center gap-2'>{t('pagination.total')} <span className='font-black'>{totals.total}</span></div>
            </div>
            <div className='flex gap-4 items-center'>{renderPageNumbers()}</div>
            <div className='flex items-center gap-5 h-full'>
                <Button onClick={goToPreviousPage}
                    className={`w-32 border h-10 rounded-md`}
                    disabled={currentPage === 1}
                >
                    {t('pagination.prev.page')}
                </Button>
                <Button onClick={goToNextPage}
                    className={`w-32 border h-10 rounded-md`}
                    disabled={currentPage === getTotalPages()}>
                    {t('pagination.next.page')}
                </Button>
            </div>

        </footer>
    );
};

export default Pagination;
