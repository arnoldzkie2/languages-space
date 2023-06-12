'use client'
import SideNav from '@/components/super-admin/SideNav';
import React, { useState } from 'react';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {


    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default Page;
