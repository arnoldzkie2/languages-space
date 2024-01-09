/* eslint-disable react/no-unescaped-entities */
'use client'
import useGlobalStore from '@/lib/state/globalStore';
import useAdminNewsStore from '@/lib/state/super-admin/newsStore';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';


interface Props {

    getAllNews: () => Promise<void>

}

const NewsDeleteWarningModal: React.FC<Props> = ({ getAllNews }) => {

    const { selectedNews, newsData, closeNewsDeleteWarning, setSelectedNews } = useAdminNewsStore()

    const { isLoading, setIsLoading } = useGlobalStore()

    const deleteNews = async () => {

        try {

            const newsIds = selectedNews.map((newsItem) => newsItem.id);
            const queryString = newsIds.map((id) => `id=${encodeURIComponent(id)}`).join('&');

            setIsLoading(true)

            if (selectedNews.length > 0) {
                var { data } = await axios.delete(`/api/news?${queryString}`);
            } else {
                var { data } = await axios.delete(`/api/news?id=${newsData.id}`)
            }

            if (data.ok) {
                setIsLoading(false)
                closeNewsDeleteWarning()
                getAllNews()
                setSelectedNews([])
            }

        } catch (error) {
            setIsLoading(false)
            alert('Something went wrong')
            console.log(error);
        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-opacity-50 bg-gray-600 py-16 z-20'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col items-center overflow-y-auto h-full w-1/2 gap-3'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this news?</h1>
                {selectedNews.length > 0
                    ?
                    selectedNews.map(news => {
                        return (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={news.id}>

                                <div>NEWS ID: <span className='font-normal text-gray-700'>{news.id}</span></div>
                                <div>AUTHOR: <span className='font-normal text-gray-700'>{news.author}</span></div>
                                <div>TITLE: <span className='font-normal text-gray-700'>{news.title}</span></div>
                            </div>
                        )
                    })
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>NEWS ID: <span className='font-normal text-gray-700'>{newsData.id}</span></div>
                        <div>AUTHOR: <span className='font-normal text-gray-700'>{newsData.author}</span></div>
                        <div>TITLE: <span className='font-normal text-gray-700'>{newsData.title}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-center mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => closeNewsDeleteWarning()}>No Cancel</button>
                    <button disabled={isLoading && true} className={`text-sm text-white rounded-lg px-3 py-2 ${isLoading ? 'bg-red-500' : 'bg-red-600 hover:bg-red-500'}`} onClick={deleteNews}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : "Yes I'm sure"}</button>
                </div>
            </div>
        </div >
    );
};

export default NewsDeleteWarningModal;
