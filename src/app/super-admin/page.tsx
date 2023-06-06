'use client'
import SideNav from '@/components/super-admin/SideNav';
import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {

    return (
        <>
            <SideNav />
        </>
    );
};

export default Page;
