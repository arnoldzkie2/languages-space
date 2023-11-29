'use client'
import ClientHeader from '@/components/client/ClientHeader';
import useClientStore from '@/lib/state/client/clientStore';
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

    return (

        <>
            <ClientHeader />
        </>
    )
}

export default Page
