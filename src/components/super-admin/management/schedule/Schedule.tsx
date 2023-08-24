import { RootState } from '@/lib/redux/Store';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';


const Schedule: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    return (
        <Link href={'/manage/schedule'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isSideNavOpen && <span className='mr-auto'>Schedule</span>}
            <FontAwesomeIcon icon={faCalendarDays} className={`${!isSideNavOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Schedule;