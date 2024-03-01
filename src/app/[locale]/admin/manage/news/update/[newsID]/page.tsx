/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import SideNav from '@/components/super-admin/SideNav';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Departments from '@/components/super-admin/management/Departments';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/global/SubmitButton';
import { Input } from '@/components/ui/input';

interface FormData {
    title: string
    content: string
    author: string
    department: string
}

interface Props {
    params: {
        newsID: string
    }
}

const UpdateNews: React.FC<Props> = ({ params }) => {

    const router = useRouter();

    const { newsID } = params

    const { quill, quillRef } = useQuill()

    const { isSideNavOpen, isLoading, setIsLoading } = useGlobalStore()
    const { departmentID, setDepartmentID } = useDepartmentStore()
    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        author: '',
        department: ''
    })

    const [keywords, setKeyWords] = useState<string[]>([]);

    const updateNews = async (e: any) => {

        e.preventDefault()

        const { title, content, author } = formData

        if (!title) return toast('Title is required')
        if (!content) return toast('Content is required')
        if (!author) return toast('Author is required')

        try {
            setIsLoading(true)
            const { data } = await axios.patch(`/api/news?newsID=${newsID}`, {
                title, content, author, keywords, departmentID
            })
            if (data.ok) {
                setIsLoading(false)
                toast("Success! news updated.")
                router.push('/admin/manage/news')
            }

        } catch (error: any) {
            setIsLoading(false)
            if (error.response.data.msg) {
                return toast(error.response.data.msg)
            }
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

    }, [quill]);

    useEffect(() => {
        if (quill) {
            retrieveNews()
        }
    }, [quill])

    const retrieveNews = async () => {

        try {

            const { data } = await axios.get(`/api/news?newsID=${newsID}`)

            if (data.ok) {

                const { keywords, title, content, author, department } = data.data;

                setFormData({ title, content, author, department: department.id });
                setDepartmentID(department.id)
                setKeyWords(keywords);

                if (quill && content) {
                    quill.root.innerHTML = content
                }

            }

        } catch (error) {
            console.log(error);
            alert('Something went wrong (retrieveNews)')
        }
    }

    const addKeyword = (event: any) => {

        if (event.key === 'Enter') {

            const keyword = event.target.value.toUpperCase();

            if (keyword) {
                setKeyWords((preKeyword) => [...preKeyword, keyword])
                event.target.value = ''
            }
        }
    };

    const removeKeyword = (index: any) => {
        setKeyWords((prevTags) => prevTags.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setFormData(prevData => ({ ...prevData, department: departmentID }))
    }, [departmentID])

    const t = useTranslations()

    return (
        <div className='h-screen overflow-y-hidden'>

            <SideNav />

            <div className={`flex flex-col h-full w-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <div className='flex px-8 border-b h-20 w-full items-center'>

                    <div className='text-xl font-bold w-52 uppercase'>{t('news.update')}</div>
                    <div className='w-full flex gap-6 items-center'>
                        <div className='w-1/4'>
                            <Departments />
                        </div>
                        <Input className='w-full' type="text" placeholder={t('info.title')} value={formData.title} onChange={(e) => setFormData(prevData => ({
                            ...prevData,
                            title: e.target.value
                        }))} />

                        <Input className='w-1/4' type="text" placeholder={t('news.author')} value={formData.author} onChange={(e) => setFormData(prevData => ({
                            ...prevData,
                            author: e.target.value
                        }))} />

                        <Input className='w-1/4' type="text" placeholder={t('info.keywords.add')} onKeyDown={addKeyword} title='Press "Enter" to add keyword' />
                    </div>

                </div>

                <div className='overflow-y-hidden p-8 pb-20 h-full w-full'>
                    <div ref={quillRef} className='w-full h-full flex flex-col justify-between border' />
                </div>

                <div className='bottom-0 w-full px-8 flex items-center h-20 py-3 justify-between gap-10 border-t'>

                    <div className='flex items-center w-full'>
                        {keywords.length > 0 && <div className='font-medium p-2 uppercase'>{t('info.keywords.h1')}:</div>}
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
                        <Button variant={'ghost'} onClick={() => router.push('/admin/manage/news')}>{t('operation.cancel')}</Button>
                        <SubmitButton msg={t('news.update')} onClick={updateNews} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNews;
