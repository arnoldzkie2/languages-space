import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

interface SettingsProps {

}

const Settings: React.FC<SettingsProps> = ({ }) => {
    return (
        <>
            <Link href={'/manage/settings'} className='flex justify-between items-center text-lg'>Settings <FontAwesomeIcon icon={faGear} /></Link>
        </>
    );
};

export default Settings;
