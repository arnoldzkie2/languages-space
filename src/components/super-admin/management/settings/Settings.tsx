import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface SettingsProps {
    isOpen: boolean
}

const Settings: React.FC<SettingsProps> = ({ isOpen }) => {
    return (
        <Link href={'/manage/settings'} className={`flex items-center hover:text-blue-600 w-full`}>
            {isOpen && <span className='mr-auto'>Settings</span>}
            <FontAwesomeIcon icon={faGear} className={`${!isOpen && 'flex justify-center w-full hover:text-blue-600 text-xl'}`} />
        </Link >
    );
};

export default Settings;
