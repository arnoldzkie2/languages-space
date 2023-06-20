'use client'
import { RootState } from '@/lib/redux/Store';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import React from 'react';
import { useSelector } from 'react-redux';

const Logout: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)
    return (
        <div className='flex items-center justify-between text-black hover:text-blue-600 cursor-pointer mt-auto'
            onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}>
            {isSideNavOpen && <span>Logout</span>}
            <FontAwesomeIcon icon={faArrowRightToBracket} className={`flex justify-center ${!isSideNavOpen && 'w-full text-xl'}`} />
        </div>
    );
}

export default Logout;
