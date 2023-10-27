/* eslint-disable react/no-unescaped-entities */
"use client"
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const SignupForm = () => {

    const router = useRouter()

    const [error, setError] = useState<string>('')

    const [isText, setIsText] = useState(false)

    const [signup, setSignup] = useState({
        user_name: '',
        name: '',
        password: '',
        confirm_password: ''
    })

    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const signupUser = async (event: any) => {

        event.preventDefault()

        const { name, user_name, password, confirm_password } = signup

        if (!name || !user_name || !password) return setError('Fill up the form!')
        if (name.length < 6) return setError('Name is to short minimum 6 characters.')
        if (user_name.length < 3) return setError('Username is to short minimum 3 characters.')
        if (password && !confirm_password) return setError('Confirm your password')
        if (password !== confirm_password) return setError('Password did not matched!')
        if (password.length < 6 || confirm_password.length < 6) return setError('Password is to short minimum 6 characters.')

        try {
            setIsLoading(true)
            const { data, status } = await axios.post('/api/client', {
                name, user_name, password
            })

            if (status === 409) return setError('Username already exist!')

            if (data.ok) {
                setIsLoading(false)
                setError('')
                router.push('/login')
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')

        }
    }

    const handleForm = (e: any) => {

        const { name, value } = e.target

        setSignup(prevData => ({
            ...prevData, [name]: value
        }))
    }

    const t = useTranslations('auth')

    return (
        <form className='flex flex-col gap-3 w-96 border p-8' onSubmit={signupUser}>
            <small className='text-center text-red-500 mb-2'>{error && error}</small>
            <input type="text"
                name='name'
                placeholder={t('name')}
                className='px-4 h-11 border outline-none'
                onChange={handleForm}
            />
            <input type="text"
                name='user_name'
                placeholder={t('username')}
                className='px-4 h-11 border outline-none'
                onChange={handleForm}
            />
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    name='password'
                    placeholder={t('password')}
                    className='px-4 h-11 border outline-none w-full'
                    onChange={handleForm}
                />
            </div>
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    name='confirm_password'
                    placeholder={t('confirm_password')}
                    className='px-4 h-11 border outline-none w-full'
                    onChange={handleForm}
                />
                {signup.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}
            </div>
            <button disabled={isLoading}
                className={`border-2 flex items-center justify-center rounded-md text-lg h-11 bg-black text-white mt-4 ${isLoading ? 'bg-opacity-70' : 'hover:bg-opacity-80'}`}>
                {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} />
                    : t('signup')}</button>
            <div className='mt-3 text-slate-500 text-center'>{t('already_signup')} <Link href='/login' className='text-black font-bold'>{t('signin')}</Link></div>
        </form >
    );
};

export default SignupForm;