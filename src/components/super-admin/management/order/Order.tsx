import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface OrderProps {
    isOpen:boolean
}

const Order: React.FC<OrderProps> = ({isOpen}) => {
    return (
        <Link href={'/manage/order'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Orders</span>}
            <FontAwesomeIcon icon={faNewspaper} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Order;
