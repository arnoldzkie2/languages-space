import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface ClientProps {

}

const Client: React.FC<ClientProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/client'} className='flex justify-between items-center text-lg'>Client <FontAwesomeIcon icon={faUser} /></Link>
        </>
    );
};

export default Client;
