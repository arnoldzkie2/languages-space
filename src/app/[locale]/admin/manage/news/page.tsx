/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import AdminSideNav from '@/components/admin/AdminSIdeNav';
import AdminNewsTable from '@/components/admin/management/news/AdmiNewsTable';
import Departments from '@/components/super-admin/management/Departments';
import DownloadTable from '@/components/super-admin/management/DownloadTable';
import Pagination from '@/components/super-admin/management/Pagination';
import NewsDeleteWarningModal from '@/components/super-admin/management/web-news/NewsDeleteWarningModal';
import NewsTable from '@/components/super-admin/management/web-news/NewsTable';
import SearchNews from '@/components/super-admin/management/web-news/SearchNews';
import { Link } from '@/lib/navigation';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminNewsStore, { ManageWebSearchQueryValue } from '@/lib/state/super-admin/newsStore';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';


const Web: React.FC = () => {

    const { currentPage, isSideNavOpen, departmentID, departments, setCurrentPage } = useGlobalStore()
    const { totalNews, news, selectedNews, deleteNewsWarning, setNews, setTotalNews } = useAdminNewsStore()
    const permissions = useAdminPageStore(s => s.permissions)
    const [searchQuery, setSearchQuery] = useState(ManageWebSearchQueryValue)

    const filteredNews = news.filter((newsItem) => {
        const searchAuthor = searchQuery.author.toUpperCase();
        const searchTitle = searchQuery.title.toUpperCase();
        const searchKeyword = searchQuery.keywords.toUpperCase();
        const searchDate = searchQuery.created_at.toUpperCase();

        const hasMatchingKeyword = newsItem.keywords.some((keyword) =>
            keyword.toUpperCase().includes(searchKeyword)
        );

        return (
            (searchTitle === '' || newsItem.title?.toUpperCase().includes(searchTitle)) &&
            (searchAuthor === '' || newsItem.author?.toUpperCase().includes(searchAuthor)) &&
            (searchKeyword === '' || hasMatchingKeyword) &&
            (searchDate === '' || newsItem.created_at.toUpperCase().includes(searchDate))
        );
    });

    const itemsPerPage = 10
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem)
    const getTotalPages = () => Math.ceil(filteredNews.length / itemsPerPage)

    const getNewsByDepartment = async () => {

        try {
            const { data } = await axios.get(`/api/news${departmentID && `?departmentID=${departmentID}`}`)

            if (data.ok) setNews(data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))
    }

    useEffect(() => {

        if (departments.length > 0) {
            getNewsByDepartment()
        } else {
            getNewsByDepartment()
            setCurrentPage(1)
            setSearchQuery(ManageWebSearchQueryValue)
        }

    }, [departmentID])

    useEffect(() => {

        setTotalNews({
            searched: filteredNews.length.toString(),
            total: news.length.toString(),
            selected: selectedNews.length.toString()
        })

    }, [news.length, filteredNews.length, selectedNews.length])

    const t = useTranslations('super-admin')

    return (
        <div className='flex h-screen'>

            <AdminSideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-bold text-gray-600 text-xl uppercase'>{t('news.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {permissions?.create_news && <Link href='/admin/manage/news/new' className='flex items-center w-32 text-gray-700 hover:text-blue-600 cursor-pointer'>
                            <div>{t('news.create')}</div>
                        </Link>}
                        {permissions?.create_news && < DownloadTable tables={news} selectedTable={selectedNews} />}
                    </ul>
                </nav>
                <div className={`flex w-full h-full px-8 gap-8 items-start  `}>

                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6 gap-4'>
                        <SearchNews handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <AdminNewsTable filteredTable={currentNews} />

                </div>

                <Pagination totals={totalNews} getTotalPages={getTotalPages} />
            </div>

            {deleteNewsWarning && <NewsDeleteWarningModal getAllNews={getNewsByDepartment} />}
        </div>
    );
};

export default Web;
