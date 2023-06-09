import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface Props {
    isOpen: boolean
}

const Client: React.FC<Props> = ({ isOpen }) => {
    return (
        <Link href={'/manage/client'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Client</span>}
            <FontAwesomeIcon icon={faUser} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Client;
