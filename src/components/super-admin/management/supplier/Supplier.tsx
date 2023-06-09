import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface SupplierProps {
    isOpen: boolean
}

const Supplier: React.FC<SupplierProps> = ({isOpen}) => {
    return (
        <Link href={'/manage/supplier'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Supplier</span>}
            <FontAwesomeIcon icon={faUsers} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Supplier;
