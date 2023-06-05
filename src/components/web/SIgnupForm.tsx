/* eslint-disable react/no-unescaped-entities */
"use client"
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { regName, regUsername, regPassword, regConfirmPassword, handleEye, setError } from '@/redux/features/auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';
const SignupForm = () => {

    const { signup, isText, error } = useSelector((state: RootState) => state.login)

    const dispatch = useDispatch()

    const signupUser = async (event: any) => {

        event.preventDefault()

        const { name, user_name, password, confirm_password } = signup

        if (!name || !user_name || !password) return dispatch(setError('Fill up the form!'))
        if (name.length < 6) return dispatch(setError('Name is to short minimum 6 characters.'))
        if (user_name.length < 3) return dispatch(setError('Username is to short minimum 3 characters.'))
        if (password && !confirm_password) return dispatch(setError('Confirm your password'))
        if (password !== confirm_password) return dispatch(setError('Password did not matched!'))
        if (password.length < 6 || confirm_password.length < 6) return dispatch(setError('Password is to short minimum 6 characters.'))

        try {

            const { data } = await axios.post('/api/client', {
                name, user_name, password
            })

            if (data?.message === 'Username already exist!') return dispatch(setError('Username already exist!'))

            if (data.success) window.location.href = '/auth/login'
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className='flex flex-col gap-3 w-96 border p-8' onSubmit={signupUser}>
            <small className='text-center text-red-500 mb-2'>{error && error}</small>
            <input type="text"
                placeholder='Enter full name'
                className='px-4 h-11 border outline-none'
                onChange={(e) => dispatch(regName(e.target.value))}
            />
            <input type="text"
                placeholder='Create username'
                className='px-4 h-11 border outline-none'
                onChange={(e) => dispatch(regUsername(e.target.value))}
            />
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    placeholder='Create password'
                    className='px-4 h-11 border outline-none w-full'
                    onChange={(e) => dispatch(regPassword(e.target.value))}
                />
            </div>
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    placeholder='Confirm password'
                    className='px-4 h-11 border outline-none w-full'
                    onChange={(e) => dispatch(regConfirmPassword(e.target.value))}
                />
                {signup.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => dispatch(handleEye())} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}
            </div>
            <button className='border-2 text-lg h-11 bg-black text-white mt-4'>Signup</button>
            <div className='mt-3 text-slate-500 text-center'>Already signed up? <Link href='/auth/login' className='text-black font-bold'>Login</Link></div>
        </form >
    );
};

export default SignupForm;
