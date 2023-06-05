/* eslint-disable react/no-unescaped-entities */
"use client"
import { signIn, signOut } from 'next-auth/react';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logUsername, logPassword, handleEye } from '@/redux/features/auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {

    const { login, isText } = useSelector((state: RootState) => state.login)

    const dispatch = useDispatch()

    const loginUser = async (event: any) => {

        event.preventDefault()

        try {

            const result = await signIn('credentials', {
                user_name: login.user_name,
                password: login.password,
                redirect: false,
            })

            if(result?.error) return alert('Invalid credentials')

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='flex flex-col gap-3 w-96 border p-10' onSubmit={loginUser}>
            <input type="text"
                placeholder='Enter username'
                className='px-4 h-11 border outline-none'
                onChange={(e) => dispatch(logUsername(e.target.value))}
            />
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    placeholder='Enter password'
                    className='px-4 h-11 border outline-none w-full'
                    onChange={(e) => dispatch(logPassword(e.target.value))}
                />
                {login.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => dispatch(handleEye())} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}                </div>
            <button className='border-2 h-11 text-lg bg-black text-white mt-4'>Login</button>
            <div className='mt-3 text-slate-500 text-center'>Don't have account yet? <Link href='/auth/signup' className='text-black font-bold'>Signup</Link></div>
        </form>
    );
};

export default LoginForm;
