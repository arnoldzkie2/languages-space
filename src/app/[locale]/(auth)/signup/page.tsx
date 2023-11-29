/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import Link from "next-intl/link";

interface SessionProps {
    status: string,
    data: any

}

const Page = () => {

    const router = useRouter()

    const session: SessionProps = useSession()

    const department = useSearchParams().get('department')

    useEffect(() => {

        setErr('')

        if (session.status !== 'loading') {
            if (session.status === 'authenticated' && session.data.user.user === 'client') {
                router.push('/client')
            } else if (session.status === 'authenticated' && session.data.user.user === 'agent') {
                router.push('/agent')
            } else if (session.status === 'authenticated' && session.data.user.user === 'supplier') {
                router.push('/supplier')
            } else if (session.status === 'authenticated' && session.data.user.user === 'admin') {
                router.push('/admin')
            } else if (session.status === 'authenticated' && session.data.user.user === 'super-admin') {
                router.push('/super-admin')
            }
        }
    }, [session])

    const [isText, setIsText] = useState(false)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: ''
    })

    const { isLoading, setIsLoading, err, setErr } = useAdminGlobalStore()

    const signupUser = async (event: any) => {

        event.preventDefault()

        const { username, password, confirm_password } = formData

        if (!username || !password) return setErr('Fill up the form!')
        if (username.length < 6) return setErr('Username is to short minimum 6 characters.')
        if(username.length > 15) return setErr('Username is to long maximum 15 characters.')
        if (password && !confirm_password) return setErr('Confirm your password')
        if (password !== confirm_password) return setErr('Password did not matched!')
        if (password.length < 6 || confirm_password.length < 6) return setErr('Password is to short minimum 6 characters.')

        try {
            setIsLoading(true)
            const { data } = await axios.post(`/api/auth/signup${department && department !== 'null' ? `?department=${department.toLocaleLowerCase()}` : ''}`, {
                username, password
            })

            if (data.ok) {
                setIsLoading(false)
                setErr('')
                router.push(`/login?department=${department}`)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const handleForm = (e: any) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData, [name]: value
        }))
    }

    const t = useTranslations('auth')

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-4xl font-bold'>{t('fillup')}</h1>
            <form className='flex flex-col gap-3 w-96 border p-8' onSubmit={signupUser}>

                {err && <small className='text-center text-red-500 mb-2 w-full py-0.5 bg-red-200'>{err}</small>}

                <input type="text"
                    name='username'
                    placeholder={t('username')}
                    value={formData.username}
                    className='px-4 h-11 border outline-none'
                    onChange={handleForm}
                />

                <div className='w-full relative'>
                    <input type={isText ? 'text' : 'password'}
                        name='password'
                        placeholder={t('password')}
                        value={formData.password}
                        className='px-4 h-11 border outline-none w-full'
                        onChange={handleForm}
                    />

                </div>
                <div className='w-full relative'>
                    <input type={isText ? 'text' : 'password'}
                        name='confirm_password'
                        placeholder={t('confirm_password')}
                        value={formData.confirm_password}
                        className='px-4 h-11 border outline-none w-full'
                        onChange={handleForm}
                    />
                    {formData.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}
                </div>
                <button disabled={isLoading}
                    className={`border-2 flex items-center justify-center rounded-md text-lg h-11 bg-black text-white mt-4 ${isLoading ? 'bg-opacity-70' : 'hover:bg-opacity-80'}`}>
                    {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} />
                        : t('signup')}</button>
                <div className='mt-3 text-slate-500 text-center'>{t('already_signup')} <Link href={`/login?department=${department}`} className='text-black font-bold'>{t('signin')}</Link></div>
            </form >        </div>
    );
};

export default Page;
