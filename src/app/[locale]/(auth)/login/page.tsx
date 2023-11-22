/* eslint-disable react/no-unescaped-entities */
'use client'
import LoginForm from '@/components/web/LoginForm';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface SessionProps {
    status: string
    data: any
    update: any;
}

const Page = () => {

    const session: SessionProps = useSession()

    useEffect(() => {
        if (session.status !== 'loading' && session.status === 'authenticated') {
            if (session.data.user.type === 'client') {
                redirect('/client')
            } else if (session.data.user.type === 'agent') {
                redirect('/agent')
            } else if (session.data.user.type === 'supplier') {
                redirect('/supplier')
            } else if (session.data.user.type === 'admin') {
                redirect('/admin')
            } else if (session.data.user.type === 'super-admin') {
                redirect('/super-admin')
            }
        }

    }, [session])

    console.log(session);

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-4xl font-bold'>Language Space</h1>
            <LoginForm />
        </div>
    );
};

export default Page;
