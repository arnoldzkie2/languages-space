import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface AgentProps {
    isOpen: boolean
}

const Agent: React.FC<AgentProps> = ({isOpen}) => {
    return (
        <Link href={'/manage/agent'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Agent</span>}
            <FontAwesomeIcon icon={faUserSecret} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Agent;
