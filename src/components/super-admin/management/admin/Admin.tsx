import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface AdminProps {

}

const Admin: React.FC<AdminProps> = ({  }) => {
    return (
        <>
                <Link href={'/manage/admin'} className='flex justify-between items-center text-lg'>Admin <FontAwesomeIcon icon={faUserShield} /></Link>
            
        </>
    );
};

export default Admin;
