/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { useLocale, useTranslations } from 'next-intl';
import Err from "@/components/global/Err";
import Success from "@/components/global/Success";

interface Props {
    searchParams: {
        department: string
    }
}


const Page = ({ searchParams }: Props) => {

    const department = searchParams.department

    const session = useSession()

    const { isLoading, setIsLoading, setErr, setOkMsg } = useAdminGlobalStore()

    const [isText, setIsText] = useState(false)
    const [formData, setFormData] = useState({
        username: '', password: ''
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const loginUser = async (event: any) => {

        event.preventDefault()

        const { username, password } = formData
        if (!username) return setErr('Phone number is required')
        if (!password) return setErr('Password cannot be empty')
        try {

            setIsLoading(true)
            const result = await signIn('credentials', {
                username, password, redirect: false
            })
            setIsLoading(false)

            console.log(result)

            if (result?.error) {
                setErr('Invalid Credentials.')
            } else {
                setErr('')
                setOkMsg('Success redirecting...')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const t = useTranslations('auth')
    const tt = useTranslations('global')

    useEffect(() => {
        if (session.status === 'authenticated') {
            switch (session.data.user.type) {
                case 'client':
                    redirect('/client')
                    break;
                case 'super-admin':
                    redirect('/super-admin')
                    break;
                case 'admin':
                    redirect('/admin')
                    break;
                case 'agent':
                    redirect('/agent')
                    break;
                case 'supplier':
                    redirect('/supplier')
                    break;
                default:
                    signIn()
            }

        }
    }, [session.status])

    const locale = useLocale()

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-4xl font-bold text-gray-800'>{t('welcome-back')}</h1>
            <form className='flex flex-col gap-3 w-96 border p-10' onSubmit={loginUser}>
                <Err />
                <Success />
                <input type="text"
                    required
                    placeholder={tt('username')}
                    name="username"
                    className='px-4 h-11 border outline-none'
                    onChange={handleChange}
                />
                <div className='w-full relative'>
                    <input type={isText ? 'text' : 'password'}
                        required
                        name="password"
                        placeholder={tt('password')}
                        className='px-4 h-11 border outline-none w-full'
                        onChange={handleChange}
                    />
                    {formData.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}</div>
                <button disabled={isLoading}
                    className={`border-2 flex items-center justify-center rounded-md h-11 bg-gray-800 text-white mt-4 ${isLoading ? 'bg-opacity-70' : 'hover:bg-opacity-80'}`}>
                    {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} />
                        : t('signin')}</button>
                <div className='mt-3 text-slate-500 text-center'>{t('not_signup')} <a href={`/${locale}/signup/?department=${department}`} className='text-gray-600 font-bold'>{t('signup')}</a></div>
            </form>
        </div>
    )
}

export default Page;
