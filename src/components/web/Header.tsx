import React from 'react';
import Link from 'next/link';

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = ({ }) => {

    return (
        <header className='h-20 fixed w-screen flex items-center top-0 left-0 px-24 justify-between text-white'>
            <h1 className='font-black text-3xl'>VERBAL-ACE</h1>
            <ul className='flex items-center gap-5'>
                <li className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-gradient-to-b from-blue-700 via-blue-500 to-cyan-400 hover:text-white'>HOME</li>
                <li className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-gradient-to-b from-blue-700 via-blue-500 to-cyan-400 hover:text-white'>ABOUT</li>
                <li className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-gradient-to-b from-blue-700 via-blue-500 to-cyan-400 hover:text-white'>CONTACT</li>
                <li className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-gradient-to-b from-blue-700 via-blue-500 to-cyan-400 hover:text-white'>SERVICES</li>
                <li className='px-4 py-2 rounded-2xl cursor-pointer hover:bg-gradient-to-b from-blue-700 via-blue-500 to-cyan-400 hover:text-white'>NEWS</li>
                <li className='flex gap-5 items-center'>
                    <Link href='/auth/signup' className=' px-3 py-2 cursor-pointer w-24 flex items-center justify-center bg-transparent rounded-3xl border'>SIGN UP</Link>
                    <Link href='/auth/login' className=' px-3 py-2 cursor-pointer w-24 flex items-center justify-center font-medium text-blue-600 bg-white rounded-3xl'>LOGIN</Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;