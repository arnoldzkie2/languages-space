/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import NewsDeleteWarningModal from '@/components/super-admin/management/web-news/NewsDeleteWarningModal';
import NewsHeader from '@/components/super-admin/management/web-news/NewsHeader';
import NewsTable from '@/components/super-admin/management/web-news/NewsTable';
import SearchNews from '@/components/super-admin/management/web-news/SearchNews';
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import useAdminNewsStore, { ManageWebSearchQueryValue } from '@/lib/state/super-admin/newsStore';
import React, { useEffect, useState } from 'react';


const Web: React.FC = () => {

    const { currentPage, isSideNavOpen, setCurrentPage } = useGlobalStore()
    const { departmentID } = useDepartmentStore()
    const { totalNews, news, selectedNews, deleteNewsWarning, getNews, setTotalNews } = useAdminNewsStore()

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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setSearchQuery(prevState => ({
            ...prevState, [name]: value
        }))
    }

    useEffect(() => {

        getNews()
        setCurrentPage(1)
        setSearchQuery(ManageWebSearchQueryValue)

    }, [departmentID])

    useEffect(() => {

        setTotalNews({
            searched: filteredNews.length.toString(),
            total: news.length.toString(),
            selected: selectedNews.length.toString()
        })

    }, [news.length, filteredNews.length, selectedNews.length])

    return (
        <div className='flex h-screen'>
            <SideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <NewsHeader />

                <div className={`flex w-full h-full px-8 gap-8 items-start  `}>

                    <div className='border py-3 px-6 flex flex-col shadow bg-card w-1/6 gap-4'>
                        <Departments />
                        <SearchNews handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <NewsTable filteredTable={currentNews} />

                </div>

                <Pagination totals={totalNews} getTotalPages={getTotalPages} />
            </div>

            {deleteNewsWarning && <NewsDeleteWarningModal />}
        </div>
    );
};

export default Web;
