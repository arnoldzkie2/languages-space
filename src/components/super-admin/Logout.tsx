'use client'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import React from 'react';

interface Props {
}

const Logout: React.FC<Props> = ({ }) => {
    return (
        <>
            <li className='flex items-center justify-between text-slate-800 hover:text-blue-600 cursor-pointer mt-auto'
                onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}>
                Logout <FontAwesomeIcon icon={faArrowRightToBracket} /></li>
        </>
    );
};

export default Logout;
