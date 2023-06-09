'use client'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import React from 'react';

interface Props {
    isOpen: boolean
}

const Logout: React.FC<Props> = ({ isOpen }) => {
    return (
        <div className='flex items-center justify-between text-black hover:text-blue-600 cursor-pointer mt-auto'
            onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}>
            {isOpen && <span>Logout</span>}
            <FontAwesomeIcon icon={faArrowRightToBracket} className={`flex justify-center ${!isOpen && 'w-full text-xl'}`} />
        </div>
    );
}

export default Logout;
