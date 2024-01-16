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
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import AdminSideNav from '@/components/admin/AdminSIdeNav';

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

    const { departmentID, isSideNavOpen, setDepartmentID, isLoading, setIsLoading } = useGlobalStore()

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

        if (!title) return alert('Title is required')
        if (!content) return alert('Content is required')
        if (!author) return alert('Author is required')

        try {
            setIsLoading(true)
            const { data } = await axios.patch(`/api/news?newsID=${newsID}`, {
                title, content, author, keywords, departmentID
            })
            if (data.ok) {

                setIsLoading(false)
                router.push('/admin/manage/news')
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')

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
            const { keywords, title, content, author, department } = data.data;
            setFormData({ title, content, author, department: department.id });
            setDepartmentID(department.id)
            setKeyWords(keywords);

            if (quill && content) {
                quill.root.innerHTML = content
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

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='h-screen overflow-y-hidden'>

            <AdminSideNav />
            <div className={`flex flex-col h-full w-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <div className='flex px-8 border-b h-20 w-full items-center bg-white'>

                    <div className='text-xl text-gray-700 font-bold w-52 uppercase'>{t('news.update')}</div>
                    <div className='w-full flex gap-6 items-center'>

                        <input className='w-full py-2 h-9 outline-none px-3 shadow-sm border' type="text" placeholder={t('news.title')} value={formData.title} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            title: e.target.value
                        }))} />

                        <input className='w-1/4 py-2 h-9 outline-none px-3 shadow-sm border' type="text" placeholder={t('news.author')} value={formData.author} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            author: e.target.value
                        }))} />

                        <input className='w-1/4 py-2 h-9 outline-none px-3 shadow-sm border' type="text" placeholder={t('news.add-keyword')} onKeyDown={addKeyword} title='Press "Enter" to add keyword' />
                    </div>

                </div>

                <div className='overflow-y-hidden p-8 pb-20 h-full w-full'>
                    <div ref={quillRef} className='w-full bg-white border h-full flex flex-col justify-between' />
                </div>

                <div className='bottom-0 w-full px-8 flex items-center h-20 bg-white py-3 justify-between gap-10 border-t'>

                    <div className='flex items-center w-full'>
                        {keywords.length > 0 && <div className='font-medium p-2 uppercase'>{t('news.keywords')}:</div>}
                        <div className='flex items-center gap-5 overflow-x-auto flex-wrap px-2 py-1  max-h-16'>
                            {keywords.length > 0 && keywords.map((item, i) => {
                                return (
                                    <div key={i} onClick={() => removeKeyword(i)} className='bg-slate-100 cursor-pointer border px-2 py-1 uppercase flex items-center gap-1'>
                                        {item}
                                        <FontAwesomeIcon icon={faXmark} width={16} height={16} />
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    <div className='flex items-center gap-9 w-1/4 justify-end'>
                        <Link href='/admin/manage/news' className='rounded-md bg-white border text-gray-700 py-2 px-4'>{tt('cancel')}</Link>
                        <button disabled={isLoading && true}
                            onClick={updateNews}
                            className={`rounded-md text-white py-2 px-4 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                            {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : t('news.update')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNews;
