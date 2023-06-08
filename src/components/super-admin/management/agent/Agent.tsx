import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface AgentProps {

}

const Agent: React.FC<AgentProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/agent'} className='flex justify-between items-center hover:text-blue-600'>Agent <FontAwesomeIcon icon={faUserSecret} /></Link>

        </>
    );
};

export default Agent;
