import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface StatisticsProps {

}

const Statistics: React.FC<StatisticsProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/statistics'} className='flex justify-between items-center text-lg'>Statistics <FontAwesomeIcon icon={faChartLine} /></Link>
        </>
    );
};

export default Statistics;
