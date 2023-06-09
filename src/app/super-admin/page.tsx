'use client'
import SideNav from '@/components/super-admin/SideNav';
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {


    const [isOpen,setIsOpen] = useState<boolean>(false)

    return (
        <>
            <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default Page;
