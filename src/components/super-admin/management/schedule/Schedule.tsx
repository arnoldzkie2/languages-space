import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface ScheduleProps {
    isOpen: boolean
}

const Schedule: React.FC<ScheduleProps> = ({ isOpen }) => {
    return (
        <Link href={'/manage/schedule'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Schedule</span>}
            <FontAwesomeIcon icon={faCalendarDays} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Schedule;
