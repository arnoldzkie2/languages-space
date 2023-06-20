import { RootState } from '@/lib/redux/Store';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Web: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    return (
        <Link href={'/manage/web'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isSideNavOpen && <span className='mr-auto'>Web Info</span>}
            <FontAwesomeIcon icon={faCircleQuestion} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Web;
