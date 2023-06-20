/* eslint-disable react-hooks/exhaustive-deps */
'use news'
import { closeOperation, openNewsDeleteWarning, openOperation, setSelectedNews } from '@/lib/redux/ManageWeb/ManageWebSlice';
import { allNewsState } from '@/lib/redux/ManageWeb/Types';
import { RootState } from '@/lib/redux/Store';
import { faEllipsis, faEye, faPenToSquare, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface NewsTableProps {

    filteredTable: allNewsState[]

}

const NewsTable: React.FC<NewsTableProps> = ({ filteredTable }) => {

    const dispatch = useDispatch()

    const { selectedNews, operation, newsSelectedID } = useSelector((state: RootState) => state.manageWeb)

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (news: allNewsState) => {

        const isSelected = selectedNews.some((selectedNews) => selectedNews.id === news.id);

        if (isSelected) {

            const updatedSelectedNews = selectedNews.filter((selectedNews) => selectedNews.id !== news.id);

            dispatch(setSelectedNews(updatedSelectedNews));

        } else {

            const updatedSelectedNews = [...selectedNews, news];

            dispatch(setSelectedNews(updatedSelectedNews));

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedNews: allNewsState[];

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

        dispatch(setSelectedNews(updatedSelectedNews));

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


    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-5/6">
            <thead className="text-xs uppercase bg-slate-50 border">
                <tr>
                    <th scope='col' className='pl-7 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />                    </th>
                    <th scope="col" className="px-1 py-3">Title</th>
                    <th scope="col" className="px-1 py-3">Author</th>
                    <th scope="col" className="px-3 py-3">Keywords</th>
                    <th scope="col" className="px-1 py-3">Date</th>
                    <th scope="col" className="px-1 py-3">Operation</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(news => (
                        <tr className="bg-white border hover:bg-slate-50" key={news.id}>
                            <td className='pl-7 py-2'>
                                <input type="checkbox" id={news.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(news)}
                                    checked={selectedNews.some(selectedNews => selectedNews.id === news.id)}
                                />                            </td>
                            <td className="px-1 py-2">
                                <label htmlFor={news.id} className='cursor-pointer'>
                                    {news.title}
                                </label>
                            </td>
                            <td className='px-1 py-2'>{news.author}</td>
                            <td className="px-1 py-2 flex gap-2">
                                <select className='outline-none p-1'>
                                    {news.keywords.length > 0 ? news.keywords.map((item, i) => {
                                        return (
                                            <option key={i}>
                                                {item}
                                            </option>
                                        )
                                    }) : <option>No Data</option>}
                                </select>
                            </td>
                            <td className="px-1 py-2">{new Date(news.date).toLocaleString()}</td>
                            <td className='py-2 relative px-1'>
                                <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer text-2xl text-black pl-7' onClick={() => dispatch(openOperation(news.id))} />
                                <ul className={`${operation && newsSelectedID === news.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' >View <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/web/update-news?newsID=${news.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>Update <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => dispatch(openNewsDeleteWarning(news))}>Delete <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => dispatch(closeOperation())}>Close <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    <tr className="bg-white border hover:bg-slate-50">
                        <td className='pl-6 py-2 '>No</td>
                        <td className='px-1 py-2 '>News</td>
                        <td className='px-1 py-2 '>...</td>
                    </tr>
                }
            </tbody>
        </table>
    );
};

export default NewsTable;
