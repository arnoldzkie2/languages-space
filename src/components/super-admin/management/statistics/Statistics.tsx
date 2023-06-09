import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface StatisticsProps {
    isOpen:boolean
}

const Statistics: React.FC<StatisticsProps> = ({isOpen}) => {
    return (
        <Link href={'/manage/statistics'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Orders</span>}
            <FontAwesomeIcon icon={faChartLine} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Statistics;
