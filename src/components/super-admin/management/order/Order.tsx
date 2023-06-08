import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface OrderProps {

}

const Order: React.FC<OrderProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/order'} className='flex justify-between items-center hover:text-blue-600'>Order <FontAwesomeIcon icon={faNewspaper} /></Link>
        </>
    );
};

export default Order;
