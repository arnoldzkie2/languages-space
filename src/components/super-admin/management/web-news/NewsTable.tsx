/* eslint-disable react-hooks/exhaustive-deps */
'use news'
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminNewsStore from '@/lib/state/super-admin/newsStore';
import { News } from '@/lib/types/super-admin/newsType';
import { faEllipsis, faEye, faPenToSquare, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import DeleteSingleNewsAlert from './DeleteSingleNewsALert';
import DeleteSelectedNewsAlert from './DeleteSelectedNewsAlert';

interface NewsTableProps {

    filteredTable: News[]

}

const NewsTable: React.FC<NewsTableProps> = ({ filteredTable }) => {

    const { selectedNews, setSelectedNews } = useAdminNewsStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const handleSelection = (news: News) => {

        const isSelected = selectedNews.some((selectedNews) => selectedNews.id === news.id);
        if (isSelected) {
            const updatedSelectedNews = selectedNews.filter((selectedNews) => selectedNews.id !== news.id);
            setSelectedNews(updatedSelectedNews)
        } else {
            const updatedSelectedNews = [...selectedNews, news];
            setSelectedNews(updatedSelectedNews)
        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedNews: News[];

        const isSelected = filteredTable.every((news) =>
            selectedNews.some((selectedNews) => selectedNews.id === news.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedNews = selectedNews.filter((selectedNews) =>
                filteredTable.every((news) => news.id !== selectedNews.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedNews = [
                ...selectedNews,
                ...filteredTable.filter(
                    (news) => !selectedNews.some((selectedNews) => selectedNews.id === news.id)
                ),
            ];
        }

        setSelectedNews(updatedSelectedNews)

    };

    useEffect(() => {

        const currentPageIds = filteredTable.map((news) => news.id);

        const areaAllNewsSellected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedNews.some((news) => news.id === id)
            );

        setIsRowChecked(areaAllNewsSellected);

    }, [selectedNews, filteredTable]);

    const t = useTranslations()

    return (
        <div className='flex flex-col w-full'>
            <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                <thead className="text-xs uppercase bg-card border">
                    <tr>
                        <th scope='col' className='py-3 px-6'>
                            <Checkbox
                                className='cursor-pointer w-4 h-4 outline-none'
                                title='Select all 10 rows'
                                checked={isRowChecked}
                                onCheckedChange={selectAllRows}
                            />                    </th>
                        <th scope="col" className="py-3 px-6">{t('info.title')}</th>
                        <th scope="col" className="py-3 px-6">{t('news.keywords')}</th>
                        <th scope="col" className="py-3 px-6">{t('news.author')}</th>
                        <th scope="col" className="py-3 px-6">{t('info.date.h1')}</th>
                        <th scope="col" className="py-3 px-6">{t('operation.h1')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(news => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={news.id}>
                                <td className='py-3 px-6 h-5 w-5'>
                                    <Checkbox id={news.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(news)}
                                        checked={selectedNews.some(selectedNews => selectedNews.id === news.id)}
                                    />
                                </td>
                                <td className="py-3 px-6 w-40">
                                    <div className='cursor-pointer' onClick={() => openTruncateTextModal(news.title)}>
                                        {returnTruncateText(news.title, 20)}
                                    </div>
                                </td>
                                <td className="py-3 px-6 h-5 w-44 overflow-x-auto">
                                    <select className='outline-none h-7 px-2 border w-full bg-card'>
                                        {news.keywords.length > 0 ? news.keywords.map((item, i) => {
                                            return (
                                                <option key={i}>
                                                    {item}
                                                </option>
                                            )
                                        }) : <option>No Data</option>}
                                    </select>
                                </td>
                                <td className="py-3 px-6 h-5 w-36 max-w-[9rem] overflow-x-auto">{news.author}</td>
                                <td className="py-3 px-6 h-5 w-44">{new Date(news.created_at).toLocaleString()}</td>
                                <td className="py-3 px-6 h-5 w-14 relative">
                                    <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer text-2xl' onClick={() => openOperation(news.id)} />
                                    <ul className={`${operation && selectedID === news.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-muted-foreground`}>
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground' >{t('operation.view')} <FontAwesomeIcon icon={faEye} /></li>
                                        {isAdminAllowed('update_news') && <Link href={`/admin/manage/news/update/${news.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                        {isAdminAllowed('delete_news') && <DeleteSingleNewsAlert news={news} />}
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                                    </ul>
                                </td>
                            </tr>
                        )) :
                        skeleton.map(item => (
                            <tr key={item} className='bg-card border'>
                                <td className='py-3 px-6'>
                                    <Skeleton className='h-5 rounded-md w-5'></Skeleton>
                                </td>
                                <td className='py-3'>
                                    <Skeleton className='h-5 rounded-3xl w-[32rem]'></Skeleton>
                                </td>
                                <td className='py-3 px-6'>
                                    <Skeleton className='h-5 rounded-3xl w-44'></Skeleton>
                                </td>
                                <td className='py-3 px-6'>
                                    <Skeleton className='h-5 rounded-3xl w-36'></Skeleton>
                                </td>
                                <td className='py-3 px-6'>
                                    <Skeleton className='h-5 rounded-3xl w-52'></Skeleton>
                                </td>
                                <td className='py-3 px-6'>
                                    <Skeleton className='h-5 rounded-3xl w-10'></Skeleton>
                                </td>
                            </tr>

                        ))
                    }
                </tbody>
                <TruncateTextModal />
            </table>
            <DeleteSelectedNewsAlert />
        </div>

    );
};

export default NewsTable;
