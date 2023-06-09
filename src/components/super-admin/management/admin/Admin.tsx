import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface AdminProps {
    isOpen: boolean
}

const Admin: React.FC<AdminProps> = ({ isOpen}) => {
    return (
        <Link href={'/manage/admin'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Admin</span>}
            <FontAwesomeIcon icon={faUserShield} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Admin;
