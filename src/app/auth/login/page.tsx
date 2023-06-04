'use client'
import { FC } from 'react';
import {signIn, signOut, useSession } from 'next-auth/react';
import type { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { handleUsername, handlePassword, handleEye } from '@/redux/features/login/loginSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const App: FC = () => {

    const session = useSession()

    console.log(session);
    

    const { user_name, password, isText } = useSelector((state: RootState) => state.login)

    const dispatch = useDispatch()

    const loginUser = async (event: any) => {

        event.preventDefault()

        try {

            const result = await signIn('credentials', {
                user_name: user_name,
                password: password,
                redirect: false
            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-4xl font-bold'>Language Space</h1>
            <form className='flex flex-col gap-3 w-96 border p-10' onSubmit={loginUser}>
                <input type="text"
                    placeholder='Enter username'
                    className='px-4 h-11 border outline-none'
                    onChange={(e) => dispatch(handleUsername(e.target.value))}
                />
                <div className='w-full relative'>
                    <input type={isText ? 'text' : 'password'}
                        placeholder='Type password'
                        className='px-4 h-11 border outline-none w-full'
                        onChange={(e) => dispatch(handlePassword(e.target.value))}
                    />
                    {password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => dispatch(handleEye())} className='cursor-pointer absolute top-4 right-4 text-slate-600' />
                    }                </div>
                <button className='border-2 h-11 bg-black text-white mt-4'>Login</button>
            </form>
            <button onClick={() => signOut()} className='border-2 h-11 bg-black text-white mt-4'>Logout</button>
        </div>
    );
};

export default App;
