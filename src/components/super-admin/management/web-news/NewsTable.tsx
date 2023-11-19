/* eslint-disable react-hooks/exhaustive-deps */
'use news'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import useAdminNewsStore from '@/lib/state/super-admin/newsStore';
import { News } from '@/lib/types/super-admin/newsType';
import { faEllipsis, faEye, faPenToSquare, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface NewsTableProps {

    filteredTable: News[]

}

const NewsTable: React.FC<NewsTableProps> = ({ filteredTable }) => {

    const { selectedNews, setSelectedNews, openNewsDeleteWarning } = useAdminNewsStore()

    const { operation, openOperation, closeOperation, selectedID } = useAdminGlobalStore()

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

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

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    const [newsTableSkeleton, setNewsTableSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-50 border">
                <tr>
                    <th scope='col' className='py-3 px-6'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />                    </th>
                    <th scope="col" className="py-3 px-6">{t('news.title')}</th>
                    <th scope="col" className="py-3 px-6">{t('news.keywords')}</th>
                    <th scope="col" className="py-3 px-6">{t('news.author')}</th>
                    <th scope="col" className="py-3 px-6">{t('news.date')}</th>
                    <th scope="col" className="py-3 px-6">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(news => (
                        <tr className="bg-white border hover:bg-slate-50" key={news.id}>
                            <td className='py-3 px-6 h-5 w-5'>
                                <input type="checkbox" id={news.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(news)}
                                    checked={selectedNews.some(selectedNews => selectedNews.id === news.id)}
                                />                            </td>
                            <td className="py-3 h-5 max-w-[32rem] w-[32rem] overflow-x-auto">
                                <label htmlFor={news.id} className='cursor-pointer w-full h-full whitespace-nowrap'>
                                    {news.title}
                                </label>
                            </td>
                            <td className=" py-3 px-6 h-5 w-44 overflow-x-auto">
                                <select className='outline-none py-1.5 px-2 border w-full'>
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
                            <td className="py-3 px-6 h-5 w-52">{new Date(news.created_at).toLocaleString()}</td>
                            <td className="py-3 px-6 h-5 w-14 relative">
                                <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer text-2xl text-black' onClick={() => openOperation(news.id)} />
                                <ul className={`${operation && selectedID === news.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' >{tt('view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/news/update-news/${news.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openNewsDeleteWarning(news)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    newsTableSkeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3 px-6'>
                                <div className='h-5 bg-slate-200 animate-pulse rounded-md w-5'></div>
                            </td>
                            <td className='py-3'>
                                <div className='h-5 bg-slate-200 animate-pulse rounded-3xl w-[32rem]'></div>
                            </td>
                            <td className='py-3 px-6'>
                                <div className='h-5 bg-slate-200 animate-pulse rounded-3xl w-44'></div>
                            </td>
                            <td className='py-3 px-6'>
                                <div className='h-5 bg-slate-200 animate-pulse rounded-3xl w-36'></div>
                            </td>
                            <td className='py-3 px-6'>
                                <div className='h-5 bg-slate-200 animate-pulse rounded-3xl w-52'></div>
                            </td>
                            <td className='py-3 px-6'>
                                <div className='h-5 bg-slate-200 animate-pulse rounded-3xl w-10'></div>
                            </td>
                        </tr>

                    ))
                }
            </tbody>
        </table>
    );
};

export default NewsTable;
