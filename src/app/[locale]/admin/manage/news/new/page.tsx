/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import SideNav from '@/components/super-admin/SideNav';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import Departments from '@/components/super-admin/management/Departments';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/global/SubmitButton';

interface FormData {
    title: string
    content: string
    author: string
}

const CreateNews = () => {

    const router = useRouter()

    const { quill, quillRef } = useQuill()

    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        author: '',
    })

    const [keywords, setKeyWords] = useState<string[]>([]);

    const { isSideNavOpen, setIsLoading } = useGlobalStore()
    const { departmentID } = useDepartmentStore()
    const createNews = async (e: React.MouseEvent) => {

        e.preventDefault()

        const { title, content, author } = formData

        if (!title) return toast('Title is required')
        if (!content) return toast('Content is required')
        if (!author) return toast('Author is required')
        if (keywords.length < 1) return toast('Add some keywords')
        if (!departmentID) return toast('Select a department to create this news')
        try {

            setIsLoading(true)

            const { data } = await axios.post('/api/news', {
                title,
                content,
                author,
                keywords: keywords,
                departmentID
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! news has been created.")
                return router.push('/admin/manage/news')
            }


        } catch (error) {
            setIsLoading(false)
            console.log(error);
            toast('Something went wrong')
        }
    }

    useEffect(() => {
        if (quill) {
            const handleQuillChange = () => {
                const editorHTML = quill.root.innerHTML;
                setFormData(prevData => ({
                    ...prevData,
                    content: editorHTML
                }));
            };
            quill.on('text-change', handleQuillChange);

            return () => {
                quill.off('text-change', handleQuillChange);
            };
        }

        console.log(quill)

    }, [quill]);


    const addKeyword = (event: any) => {

        if (event.key === 'Enter') {

            const keyword = event.target.value.toUpperCase();

            if (keyword) {

                if (!keywords.includes(keyword)) {
                    setKeyWords((preKeyword) => [...preKeyword, keyword])
                    event.target.value = ''
                }
                event.target.value = ''
            }
        }
    };

    const removeKeyword = (index: any) => {
        setKeyWords((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='h-screen'>

            <SideNav />

            <div className={`flex flex-col w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <div className='flex px-8 border-b h-20 w-full items-center'>

                    <div className='text-2xl uppercase font-bold w-52'>{t('news.create')}</div>
                    <div className='w-full flex gap-6 items-center'>
                        <div className='w-1/4'>
                            <Departments />
                        </div>
                        <Input placeholder={t('news.title')} value={formData.title} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            title: e.target.value
                        }))} />

                        <Input className='w-1/4' placeholder={t('news.author')} value={formData.author} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            author: e.target.value
                        }))} />

                        <Input className='w-1/4' placeholder={t('news.add-keyword')} onKeyDown={addKeyword} title='Press "Enter" to add keyword' />
                    </div>

                </div>

                <div className='overflow-y-hidden p-8 pb-20 h-full w-full'>
                    <div ref={quillRef} className='w-full h-full flex flex-col justify-between border' />
                </div>

                <div className='bottom-0 w-full px-8 flex items-center h-20 py-3 justify-between gap-10 border-t'>

                    <div className='flex items-center w-full'>
                        <div className='font-medium p-2 uppercase'>{t('news.keywords')}:</div>
                        <div className='flex items-center gap-5 overflow-x-auto flex-wrap px-2 py-1  max-h-16'>
                            {keywords.length > 0 && keywords.map((item, i) => {
                                return (
                                    <div key={i} onClick={() => removeKeyword(i)} className='bg-secondary cursor-pointer border px-2 py-1 uppercase flex items-center gap-1'>
                                        {item}
                                        <FontAwesomeIcon icon={faXmark} width={16} height={16} />
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    <div className='flex items-center gap-9 w-1/4 justify-end'>
                        <Button variant={'ghost'} onClick={() => router.push('/admin/manage/news')}>{tt('cancel')}</Button>
                        <SubmitButton msg={t('news.create')} onClick={createNews} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNews;
