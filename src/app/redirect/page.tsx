'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface SessionProps {
    status: string,
    data: any

}
const Page = () => {

    const session: SessionProps = useSession()

    useEffect(() => {
        if (session.status !== 'loading') {
            if (session.status === 'authenticated' && session.data.user.user === 'client') {
                redirect('/client')
            } else if (session.status === 'authenticated' && session.data.user.user === 'agent') {
                redirect('/agent')
            } else if (session.status === 'authenticated' && session.data.use.user === 'supplier') {
                redirect('/supplier')
            } else if (session.status === 'authenticated' && session.data.user.user === 'admin') {
                redirect('/admin')
            } else if (session.status === 'authenticated' && session.data.user.user === 'super-admin') {
                redirect('/super-admin')
            } else {
                redirect('/auth/login')
            }
        }
    }, [session])

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-4xl font-bold'>Languages Space</h1>
            <p className="text-lg text-white bg-black px-3">{session.status === 'loading' ? 'Redirecting...' : 'You are not loged in!'}</p>
        </div>
    );
};

export default Page;
