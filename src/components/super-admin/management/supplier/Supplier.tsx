import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface SupplierProps {

}

const Supplier: React.FC<SupplierProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/supplier'} className='flex justify-between items-center hover:text-blue-600'>Supplier <FontAwesomeIcon icon={faUsers} /></Link>

        </>
    );
};

export default Supplier;
