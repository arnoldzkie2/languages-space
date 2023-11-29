'use client'
import ClientHeader from '@/components/client/ClientHeader';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

interface PageProps {
}

const Page: React.FC<PageProps> = ({ }) => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    if (session.status === 'loading') {
        return (
            <div className='w-screen h-screen grid place-content-center'>
                <FontAwesomeIcon icon={faSpinner} width={50} height={50} className='animate-spin w-[50px] h-[50px]' />
            </div>
        )
    } else {
        return (

            <>
                <ClientHeader />
            </>
        )
    }

};

export default Page
