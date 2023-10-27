/* eslint-disable react/no-unescaped-entities */
"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import axios from 'axios';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { useTranslations } from 'next-intl';

const LoginForm = () => {

    const user_name = useRef('')

    const password = useRef('')

    const [isText, setIsText] = useState(false)

    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const loginUser = async (event: any) => {
        event.preventDefault()
        try {

            setIsLoading(true)
            const result = await signIn('credentials', {
                user_name: user_name.current,
                password: password.current,
                redirect: false,
            })

            setIsLoading(false)
            if (result?.error) return alert('Invalid credentials')


        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const t = useTranslations('auth')

    return (
        <form className='flex flex-col gap-3 w-96 border p-10' onSubmit={loginUser}>
            <input type="text"
                required
                placeholder={t('username')}
                className='px-4 h-11 border outline-none'
                onChange={(e) => user_name.current = e.target.value}
            />
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    required
                    placeholder={t('password')}
                    className='px-4 h-11 border outline-none w-full'
                    onChange={(e) => password.current = e.target.value}
                />
                {password.current && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}</div>
            <button disabled={isLoading}
                className={`border-2 flex items-center justify-center rounded-md text-lg h-11 bg-black text-white mt-4 ${isLoading ? 'bg-opacity-70' : 'hover:bg-opacity-80'}`}>
                {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} />
                    : t('signin')}</button>
            <div className='mt-3 text-slate-500 text-center'>{t('not_signup')} <Link href='/signup' className='text-black font-bold'>{t('signup')}</Link></div>
        </form>
    );
};

export default LoginForm;