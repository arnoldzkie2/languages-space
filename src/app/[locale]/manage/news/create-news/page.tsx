/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import SideNav from '@/components/super-admin/SideNav';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import Departments from '@/components/super-admin/management/Departments';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';

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

    const { departmentID, isSideNavOpen, setDepartmentID, isLoading, setIsLoading } = useAdminGlobalStore()

    const createNews = async (e: any) => {

        e.preventDefault()

        const { title, content, author } = formData

        if (!title) return alert('Title is required')

        if (!content) return alert('Content is required')

        if (!author) return alert('Author is required')

        if (keywords.length < 1) return alert('Add some keywords')

        if (!departmentID) return alert('Select a department to create this news')

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

                return router.push('/manage/news')

            }


        } catch (error) {

            setIsLoading(false)

            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {

        setDepartmentID('')

    }, [])

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

    return (
        <div className='h-screen'>

            <SideNav />

            <div className={`flex flex-col w-full h-full pb-5 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <div className='flex items-center justify-between px-10 border-b h-20 bg-white'>
                    <div className='text-2xl text-gray-700 font-bold'>Create news</div>
                    <div className='flex items-center w-1/2 gap-5'>
                        <div className='w-full'>
                            <Departments />
                        </div>
                        <input className='w-full py-1 h-9 outline-none px-3 shadow-sm border' type="text" placeholder='Title' value={formData.title} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            title: e.target.value
                        }))} />

                        <input className='w-full py-1 h-9 outline-none px-3 shadow-sm border' type="text" placeholder='Author' value={formData.author} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            author: e.target.value
                        }))} />

                        <input className='w-full py-1 h-9 outline-none px-3 shadow-sm border' type="text" placeholder='Add Keyword' onKeyDown={addKeyword} title='Press "Enter" to add keyword' />

                    </div>
                </div>

                <div className='overflow-x-auto p-10 h-full w-full'>
                    <div ref={quillRef} className='p-0' />
                </div>
                <div className='flex items-center justify-between gap-10 px-5'>
                    <div className='flex items-center'>
                        {keywords.length > 0 && <div className='font-medium p-2'>KEYWORDS:</div>}
                        <div className='flex items-center gap-5 overflow-x-auto flex-wrap px-2  max-h-16'>
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
                    <div className='flex items-center gap-9 min-w-fit px-10'>
                        <Link href='/manage/news' className='rounded-sm bg-white border-blue-600 border text-blue-600 py-2 px-4'>Go Back</Link>
                        <button disabled={isLoading && true} onClick={createNews} className={`rounded-sm text-white px-4 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} py-2 flex items-center justify-center`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : 'Create News'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNews;