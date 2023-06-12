import React, { Dispatch, SetStateAction } from 'react';
import Dashboard from './management/dashboard/Dashboard';
import Client from './management/client/Client';
import Schedule from './management/schedule/Schedule';
import Supplier from './management/supplier/Supplier';
import Agent from './management/agent/Agent';
import Admin from './management/admin/Admin';
import Order from './management/order/Order';
import Statistics from './management/statistics/Statistics';
import Settings from './management/settings/Settings';
import Web from './management/web/Web';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';

interface Props {

    isOpen: boolean

    setIsOpen: Dispatch<SetStateAction<boolean>>

}

const SideNav: React.FC<Props> = ({ isOpen, setIsOpen }) => {

    return (
        <nav className={`border h-screen ${isOpen ? 'w-44 p-6' : 'w-16 px-3 py-6'}  flex flex-col shadow-md bg-white`}>
            {
                isOpen ?
                    <button
                        onClick={() => setIsOpen(false)}
                        className='text-lg flex justify-between items-center pb-4 border-b border-gray-600 hover:text-blue-600'>
                        Menu <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    :
                    <FontAwesomeIcon icon={faBars}
                        className='pb-4 border-b text-xl text-black border-gray-600 cursor-pointer hover:text-blue-600'
                        onClick={() => setIsOpen(true)} />
            }
            <ul className='flex flex-col gap-7 h-full py-7 justify-center'>
                <Dashboard isOpen={isOpen} />
                <Client isOpen={isOpen} />
                <Schedule isOpen={isOpen} />
                <Supplier isOpen={isOpen} />
                <Agent isOpen={isOpen} />
                <Admin isOpen={isOpen} />
                <Order isOpen={isOpen} />
                <Statistics isOpen={isOpen} />
                <Web isOpen={isOpen} />
                <Settings isOpen={isOpen} />
            </ul>
            <Logout isOpen={isOpen} />
        </nav>
    );
};

export default SideNav;
