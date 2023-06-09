import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface Props {
    isOpen: boolean
}
const Web: React.FC<Props> = ({ isOpen }) => {

    return (
        <Link href={'/manage/web'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Web Info</span>}
            <FontAwesomeIcon icon={faCircleQuestion} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Web;
