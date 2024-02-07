/* eslint-disable react/no-unescaped-entities */
'use client'
import Err from '@/components/global/Err';
import SubmitButton from '@/components/global/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminNewsStore from '@/lib/state/super-admin/newsStore';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import React from 'react';


const NewsDeleteWarningModal: React.FC = () => {

    const { selectedNews, newsData, closeNewsDeleteWarning, setSelectedNews, getNews } = useAdminNewsStore()

    const { setIsLoading } = useGlobalStore()

    const deleteNews = async (e: React.FormEvent) => {

        e.preventDefault()
        try {

            const newsIds = selectedNews.map((newsItem) => newsItem.id);
            const queryString = newsIds.map((id) => `newsID=${encodeURIComponent(id)}`).join('&');

            setIsLoading(true)
            if (selectedNews.length > 0) {
                var { data } = await axios.delete(`/api/news?${queryString}`);
            } else {
                var { data } = await axios.delete(`/api/news?newsID=${newsData.id}`)
            }

            if (data.ok) {
                setIsLoading(false)
                closeNewsDeleteWarning()
                getNews()
                setSelectedNews([])
            }

        } catch (error) {
            setIsLoading(false)
            alert('Something went wrong')
            console.log(error);
        }
    }

    const tt = useTranslations("global")

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-opacity-50 backdrop-blur py-16 z-20'>
            <Card className='w-1/4'>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this news?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='flex flex-col overflow-y-auto h-full w-full gap-3' onSubmit={deleteNews}>
                        {selectedNews.length > 0
                            ?
                            selectedNews.map(news => {
                                return (
                                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={news.id}>

                                        <div>NEWS ID: <span className='font-normal text-muted-foreground'>{news.id}</span></div>
                                        <div>TITLE: <span className='font-normal text-muted-foreground'>{news.title}</span></div>
                                    </div>
                                )
                            })
                            :
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                                <div>NEWS ID: <span className='font-normal text-muted-foreground'>{newsData.id}</span></div>
                                <div>TITLE: <span className='font-normal text-muted-foreground'>{newsData.title}</span></div>
                            </div>
                        }
                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button variant={'ghost'} onClick={closeNewsDeleteWarning}>{tt('close')}</Button>
                            <SubmitButton msg={tt('confirm')} variant={'destructive'} />
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div >
    );
};

export default NewsDeleteWarningModal;
