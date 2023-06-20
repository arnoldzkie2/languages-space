/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import SideNav from '@/components/super-admin/SideNav';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface FormData {
    title: string
    content: string
    author: string
}

interface Props {
    searchParams: {
        newsID: string
    }
}
const UpdateNews: React.FC<Props> = ({ searchParams }) => {

    const router = useRouter();

    const { newsID } = searchParams

    const { quill, quillRef } = useQuill()

    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        author: '',
    })

    const [keywords, setKeyWords] = useState<string[]>([]);

    const udateNews = async (e: any) => {

        e.preventDefault()

        const { title, content, author } = formData

        if (!title) return alert('Title is required')

        if (!content) return alert('Content is required')

        if (!author) return alert('Author is required')

        try {
            const { data } = await axios.patch(`/api/news?id=${newsID}`, {
                title: formData.title,
                content: formData.content,
                author: formData.author,
                keywords: keywords
            })

            if (data.success) return router.push('/manage/web')

            alert('Something went wrong')

        } catch (error) {
            console.log(error);
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

        retrieveNews()

    }, [quill])

    const retrieveNews = async () => {

        try {

            const { data } = await axios.get(`/api/news?id=${newsID}`)

            const { keywords, title, content, author } = data.data;

            setFormData({ title, content, author });

            setKeyWords(keywords);

            if (quill && content) {

                quill.root.innerHTML = content

            }

        } catch (error) {

            console.log(error);

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

    return (
        <div className='flex bg-white h-screen'>

            <SideNav />

            <div className='flex flex-col w-full max-h-full py-5 px-10'>
                <div className='flex items-center justify-between px-10 py-3 border shadow'>
                    <div className='text-2xl text-gray-700 font-bold'>Create news</div>
                    <div className='flex items-center w-1/2 gap-5'>

                        <input className='w-full py-1 h-9 outline-none px-3 text-lg shadow-sm border' type="text" placeholder='Title' value={formData.title} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            title: e.target.value
                        }))} />

                        <input className='w-full py-1 h-9 outline-none px-3 text-lg shadow-sm border' type="text" placeholder='Author' value={formData.author} onChange={(e: any) => setFormData(prevData => ({
                            ...prevData,
                            author: e.target.value
                        }))} />

                        <input className='w-full py-1 h-9 outline-none px-3 text-lg shadow-sm border' type="text" placeholder='Add Keyword' onKeyDown={addKeyword} title='Press "Enter" to add keyword' />

                    </div>
                </div>
                <div className='mt-7 mb-9 overflow-x-auto border h-full'>
                    <div ref={quillRef} className='p-0' />
                </div>

                <div className='flex items-center justify-between gap-10'>
                    <div className='flex items-center'>
                        {keywords.length > 0 && <div className='font-medium p-2'>KEYWORDS:</div>}
                        <div className='flex items-center gap-5 overflow-x-auto flex-wrap px-2  max-h-16'>
                            {keywords.length > 0 && keywords.map((item, i) => {
                                return (
                                    <div key={i} className='bg-slate-100 shadow border px-2 py-1 uppercase flex items-center gap-1'>
                                        {item}
                                        <FontAwesomeIcon icon={faXmark} onClick={() => removeKeyword(i)} className='cursor-pointer' />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='flex items-center gap-9 min-w-fit'>
                        <Link href='/manage/web' className='rounded-sm bg-white border-blue-600 border text-blue-600 py-2 px-4'>Go Back</Link>
                        <button onClick={udateNews} className='rounded-sm bg-blue-600 text-white px-4 hover:bg-opacity-80 py-2'>Update News</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNews;
