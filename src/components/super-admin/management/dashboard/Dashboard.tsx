import { RootState } from '@/lib/redux/Store';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    return (
        <Link href={'/super-admin'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isSideNavOpen && <span className='mr-auto'>Dashboard</span>}
            <FontAwesomeIcon icon={faHouse} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Dashboard;
