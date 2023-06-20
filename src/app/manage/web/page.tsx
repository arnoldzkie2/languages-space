/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import Departments from '@/components/super-admin/management/Departments';
import Pagination from '@/components/super-admin/management/Pagination';
import NewsDeleteWarningModal from '@/components/super-admin/management/web/NewsDeleteWarningModal';
import NewsTable from '@/components/super-admin/management/web/NewsTable';
import SearchNews from '@/components/super-admin/management/web/SearchNews';
import WebHeader from '@/components/super-admin/management/web/WebHeader';
import { setCurrentPage } from '@/lib/redux/GlobalState/GlobalSlice';
import { ManageWebSearchQueryValue } from '@/lib/redux/ManageWeb/DefaultValue';
import { setNews, setSelectedNews, setTotalNews } from '@/lib/redux/ManageWeb/ManageWebSlice';
import { RootState } from '@/lib/redux/Store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const Web: React.FC = () => {

    const dispatch = useDispatch()

    const { currentPage, isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    const { totalNews, news, selectedNews, deleteWarning } = useSelector((state: RootState) => state.manageWeb)

    const [searchQuery, setSearchQuery] = useState(ManageWebSearchQueryValue)

    const filteredNews = news.filter((newsItem) => {
        const searchAuthor = searchQuery.author.toUpperCase();
        const searchTitle = searchQuery.title.toUpperCase();
        const searchKeyword = searchQuery.keywords.toUpperCase();
        const searchDate = searchQuery.date.toUpperCase();

        const hasMatchingKeyword = newsItem.keywords.some((keyword) =>
            keyword.toUpperCase().includes(searchKeyword)
        );

        return (
            (searchTitle === '' || newsItem.title?.toUpperCase().includes(searchTitle)) &&
            (searchAuthor === '' || newsItem.author?.toUpperCase().includes(searchAuthor)) &&
            (searchKeyword === '' || hasMatchingKeyword) &&
            (searchDate === '' || newsItem.date.toUpperCase().includes(searchDate))
        );
    });


    const itemsPerPage = 10

    const indexOfLastItem = currentPage * itemsPerPage

    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredNews.length / itemsPerPage)

    const getAllNews = async () => {

        try {

            const { data } = await axios.get('/api/news')

            if (data.success) {

                return dispatch(setNews(data.data))

            }

            alert('Something went wrong')

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

        getAllNews()

        setSearchQuery(ManageWebSearchQueryValue)

        dispatch(setCurrentPage(1))

    }, [])

    useEffect(() => {

        dispatch(setTotalNews({
            searched: filteredNews.length.toString(),
            total: news.length.toString(),
            selected: selectedNews.length.toString()
        }))

    }, [news.length, filteredNews.length, selectedNews.length])

    return (
        <div className='flex bg-slate-50'>
            <SideNav />
            <div className={`flex flex-col w-full h-full ${isSideNavOpen ? 'p-5' : 'px-10 py-5'}`}>

                <WebHeader />

                <div className={`flex w-full h-full ${isSideNavOpen ? 'gap-5' : 'gap-10'} my-8`}>
                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchNews handleSearch={handleSearch} searchQuery={searchQuery} />
                    </div>

                    <NewsTable filteredTable={currentNews} />

                </div>

                <Pagination total={totalNews} getTotalPages={getTotalPages} />

            </div>

            {deleteWarning && <NewsDeleteWarningModal getAllNews={getAllNews}/>}
        </div>
    );
};

export default Web;
