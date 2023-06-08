import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface Props {

}

const Client: React.FC<Props> = ({ }) => {
    return (
        <>
            <Link href={'/manage/client'} className='flex justify-between items-center hover:text-blue-600'>Client <FontAwesomeIcon icon={faUser} /></Link>
        </>
    );
};

export default Client;
