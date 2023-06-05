'use client'
import { signOut } from 'next-auth/react';
import React from 'react';

interface PageProps {
}

const Page: React.FC<PageProps> = ({  }) => {
    return (
        <>
            Hello world!
            <button onClick={() => signOut({
                redirect: true,
                callbackUrl: '/auth/login'
            })}>Logout</button>
        </>
    );
};

export default Page;
