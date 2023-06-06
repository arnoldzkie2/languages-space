import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = ({ }) => {
    return (
        <>
            <Link href={'/super-admin'} className='flex justify-between items-center text-lg'>Dashboard <FontAwesomeIcon icon={faHouse} /></Link>
        </>
    );
};

export default Dashboard;
