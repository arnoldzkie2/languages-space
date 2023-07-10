/* eslint-disable react/no-unescaped-entities */
'use client'
import { closeNewsDeleteWarning, setSelectedNews } from '@/lib/redux/ManageWeb/ManageWebSlice';
import { RootState } from '@/lib/redux/Store';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';


interface Props {

    getAllNews: () => Promise<{
        payload: any;
        type: "manage_web/setNews";
    } | undefined>

}

const NewsDeleteWarningModal: React.FC<Props> = ({ getAllNews }) => {

    const { selectedNews, targetNews } = useSelector((state: RootState) => state.manageWeb)

    const dispatch = useDispatch()

    const deleteNews = async () => {

        try {

            if (selectedNews.length > 0) {

                const newsIds = selectedNews.map((newsItem) => newsItem.id);

                const queryString = newsIds.map((id) => `id=${encodeURIComponent(id)}`).join('&');

                var { data } = await axios.delete(`/api/news?${queryString}`);

            } else {

                var { data } = await axios.delete(`/api/news?id=${targetNews.id}`)

            }

            if (!data.success) alert('Something went wrong')

            dispatch(closeNewsDeleteWarning())

            getAllNews()

            dispatch(setSelectedNews([]))

        } catch (error) {

            console.log(error);

        }
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-opacity-50 bg-gray-600 py-16'>
            <div className='bg-white p-10 rounded-lg shadow-lg flex flex-col overflow-y-auto h-full gap-3'>
                <h1 className='text-xl pb-4'>Are you sure you want to delete this news?</h1>
                {selectedNews.length > 0
                    ?
                    selectedNews.map(news => {
                        return (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={news.id}>
                                <div>NEWS ID: <span className='font-normal text-gray-700'>{news.id}</span></div>
                                <div>TITLE: <span className='font-normal text-gray-700'>{news.title}</span></div>
                            </div>
                        )
                    })
                    :
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>NEWS ID: <span className='font-normal text-gray-700'>{targetNews.id}</span></div>
                        <div>TITLE: <span className='font-normal text-gray-700'>{targetNews.title}</span></div>
                    </div>
                }
                <div className='flex items-center w-full justify-center mt-5 gap-5'>
                    <button className='text-sm border py-2 px-3 rounded-lg hover:bg-gray-100' onClick={() => dispatch(closeNewsDeleteWarning())}>No Cancel</button>
                    <button className='text-sm text-white bg-red-600 rounded-lg px-3 py-2 hover:bg-red-700' onClick={deleteNews}>Yes I'm sure</button>
                </div>
            </div>
        </div >
    );
};

export default NewsDeleteWarningModal;
