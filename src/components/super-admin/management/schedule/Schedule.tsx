import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface ScheduleProps {
}

const Schedule: React.FC<ScheduleProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/schedule'} className='flex justify-between items-center hover:text-blue-600'>Schedule <FontAwesomeIcon icon={faCalendarDays} /></Link>

        </>
    );
};

export default Schedule;
