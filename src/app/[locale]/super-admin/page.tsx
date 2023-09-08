'use client'
import SideNav from '@/components/super-admin/SideNav';
import React from 'react';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {

    return (
        <div className='flex h-screen'>
            <SideNav  />
        </div>
    );
};

export default Page;
