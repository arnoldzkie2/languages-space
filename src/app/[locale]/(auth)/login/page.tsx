/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Err from "@/components/global/Err";
import Success from "@/components/global/Success";
import { useRouter } from "@/lib/navigation";
import useGlobalStore from "@/lib/state/globalStore";
import { Button } from "@/components/ui/button";
import * as z from "zod"
import SubmitButton from "@/components/global/SubmitButton";

interface Props {
    searchParams: {
        department: string
        agent: string
    }
}

const Page = ({ searchParams }: Props) => {

    const { agent, department } = searchParams
    const router = useRouter()
    const session = useSession()
    const { setIsLoading, setErr, setOkMsg } = useGlobalStore()

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

            if (result?.error) {
                setErr('Invalid Credentials.')
            } else {
                setErr('')
                setOkMsg('Success redirecting...')
            }

        } catch (error: any) {
            setIsLoading(false)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const t = useTranslations('auth')
    const tt = useTranslations('global')

    useEffect(() => {
        if (session.status === 'authenticated') {
            switch (session.data.user.type) {
                case 'client':
                    router.push('/client')
                    break;
                case 'super-admin':
                    router.push('/super-admin')
                    break;
                case 'admin':
                    router.push('/admin')
                    break;
                case 'agent':
                    router.push('/agent/invite')
                    break;
                case 'supplier':
                    router.push('/supplier/schedule')
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
                <SubmitButton msg={t('signup')} style="w-full py-2 text-white rounded-sm mt-3" />

                <div className='mt-3 text-slate-500 text-center'>
                    <div>
                        {t('not_signup')}
                    </div>
                    <a href={`/${locale}/signup?department=${department || ''}&agent=${agent || ''}`} className='text-gray-700 hover:text-black font-bold'>{t('signup')}</a>
                </div>
            </form>
        </div>
    )
}

export default Page;
