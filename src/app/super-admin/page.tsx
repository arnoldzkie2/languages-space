'use client'
import SideNav from '@/components/super-admin/SideNav';
import React, { useState } from 'react';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {


    return (
        <div className='flex h-screen'>
            <SideNav  />
            <div className='w-full h-full flex items-center justify-center'>Hello World</div>
        </div>
    );
};

export default Page;
