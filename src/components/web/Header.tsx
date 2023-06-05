import React from 'react';
import Link from 'next/link';

interface HeaderProps {
    
}

const Header: React.FC<HeaderProps> = ({ }) => {

    return (
        <header className='h-14 shadow fixed w-screen flex items-center top-0 left-0 px-24 justify-between'>
            <h1>LANGUAGES-SPACE</h1>
            <ul className='flex items-center gap-3'>
                <li className=''>HOME</li>
                <li className=''>ABOUT US</li>
                <li className=''>CONTACT US</li>
                <Link href='/auth/login' className='cursor-pointer bg-black text-white w-24 h-8 flex items-center justify-center'>SIGN IN</Link>
            </ul>
        </header>
    );
};

export default Header;
