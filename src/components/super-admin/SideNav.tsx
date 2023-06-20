'use client'
import React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import { setIsSideNavOpen } from '@/lib/redux/GlobalState/GlobalSlice';

const SideNav: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)
    
    const dispatch = useDispatch()

    return (
        <nav className={`border h-screen ${isSideNavOpen ? 'w-44 p-6' : 'w-16 px-3 py-6'}  flex flex-col shadow-md bg-white`}>
            {
                isSideNavOpen ?
                    <button
                        onClick={() => dispatch(setIsSideNavOpen())}
                        className='text-lg flex justify-between items-center pb-4 border-b border-gray-600 hover:text-blue-600'>
                        Menu <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    :
                    <FontAwesomeIcon icon={faBars}
                        className='pb-4 border-b text-xl text-black border-gray-600 cursor-pointer hover:text-blue-600'
                        onClick={() => dispatch(setIsSideNavOpen())} />
            }
            <ul className='flex flex-col gap-7 h-full py-7 justify-center'>
                <Dashboard  />
                <Client  />
                <Schedule  />
                <Supplier  />
                <Agent  />
                <Admin  />
                <Order  />
                <Statistics  />
                <Web  />
                <Settings  />
            </ul>
            <Logout  />
        </nav>
    );
};

export default SideNav;
