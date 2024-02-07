import SideNav from '@/components/super-admin/SideNav';
import React from 'react';

const Page = ({ }) => {

    return (
        <div className='flex h-screen'>
            <SideNav />
            <div className='text-foreground font-black text-3xl w-screen h-screen grid place-items-center'>Hello World</div>
        </div>
    )
}

export default Page
