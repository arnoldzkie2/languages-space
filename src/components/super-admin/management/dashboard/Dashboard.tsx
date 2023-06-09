import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface DashboardProps {
    isOpen: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen }) => {
    return (
        <Link href={'/super-admin'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Dashboard</span>}
            <FontAwesomeIcon icon={faHouse} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Dashboard;
