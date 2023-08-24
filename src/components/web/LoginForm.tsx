/* eslint-disable react/no-unescaped-entities */
"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import axios from 'axios';

const LoginForm = () => {

    const user_name = useRef('')

    const password = useRef('')

    const [isText, setIsText] = useState(false)

    const loginUser = async (event: any) => {

        event.preventDefault()

        try {

            const result = await signIn('credentials', {
                user_name: user_name.current,
                password: password.current,
                redirect: false,
            })

            if (result?.error) return alert('Invalid credentials')

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='flex flex-col gap-3 w-96 border p-10' onSubmit={loginUser}>
            <input type="text"
                placeholder='Enter username'
                className='px-4 h-11 border outline-none'
                onChange={(e) => user_name.current = e.target.value}
            />
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    placeholder='Enter password'
                    className='px-4 h-11 border outline-none w-full'
                    onChange={(e) => password.current = e.target.value}
                />
                {password.current && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}</div>
            <button className='border-2 h-11 text-lg bg-black text-white mt-4'>Login</button>
            <div className='mt-3 text-slate-500 text-center'>Don't have account yet? <Link href='/signup' className='text-black font-bold'>Signup</Link></div>
        </form>
    );
};

export default LoginForm;