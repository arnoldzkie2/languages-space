import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

const Web: React.FC = () => {


    return (
        <>
            <Link href={'/manage/web'} className='flex justify-between items-center text-slate-800 hover:text-blue-600'>Web Info <FontAwesomeIcon icon={faCircleQuestion} /></Link>

        </>
    );
};

export default Web;
