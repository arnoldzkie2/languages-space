'use client'
import ClientHeader from '@/components/client/ClientHeader';
import { signOut } from 'next-auth/react';
import React from 'react';

interface PageProps {
}

const Page: React.FC<PageProps> = ({ }) => {
    return (
        <>
            <ClientHeader />
        </>
    );
};

export default Page
