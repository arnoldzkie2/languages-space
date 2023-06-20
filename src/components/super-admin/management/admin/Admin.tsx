import { RootState } from '@/lib/redux/Store';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';


const Admin: React.FC = ({ }) => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)
    return (
        <Link href={'/manage/admin'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isSideNavOpen && <span className='mr-auto'>Admin</span>}
            <FontAwesomeIcon icon={faUserShield} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Admin;
