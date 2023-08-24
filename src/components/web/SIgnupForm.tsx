/* eslint-disable react/no-unescaped-entities */
"use client"
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
const SignupForm = () => {

    const [error, setError] = useState<string>('')

    const [isText, setIsText] = useState(false)

    const [signup, setSignup] = useState({
        user_name: '',
        name: '',
        password: '',
        confirm_password: ''
    })

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

            const { data } = await axios.post('/api/client', {
                name, user_name, password
            })

            if (data?.message === 'Username already exist!') return setError('Username already exist!')

            if(data.success) setError('')

            if (data.success) window.location.href = '/login'

        } catch (error) {
            console.log(error);
        }
    }

    const handleForm = (e: any) => {

        const { name, value } = e.target

        setSignup(prevData => ({
            ...prevData, [name]: value
        }))
    }

    return (
        <form className='flex flex-col gap-3 w-96 border p-8' onSubmit={signupUser}>
            <small className='text-center text-red-500 mb-2'>{error && error}</small>
            <input type="text"
                name='name'
                placeholder='Enter full name'
                className='px-4 h-11 border outline-none'
                onChange={handleForm}
            />
            <input type="text"
                name='user_name'
                placeholder='Create username'
                className='px-4 h-11 border outline-none'
                onChange={handleForm}
            />
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    name='password'
                    placeholder='Create password'
                    className='px-4 h-11 border outline-none w-full'
                    onChange={handleForm}
                />
            </div>
            <div className='w-full relative'>
                <input type={isText ? 'text' : 'password'}
                    name='confirm_password'
                    placeholder='Confirm password'
                    className='px-4 h-11 border outline-none w-full'
                    onChange={handleForm}
                />
                {signup.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-4 right-4 text-slate-600' />}
            </div>
            <button className='border-2 text-lg h-11 bg-black text-white mt-4'>Signup</button>
            <div className='mt-3 text-slate-500 text-center'>Already signed up? <Link href='/login' className='text-black font-bold'>Login</Link></div>
        </form >
    );
};

export default SignupForm;