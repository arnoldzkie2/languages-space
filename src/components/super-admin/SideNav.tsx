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

interface SideNavProps {
}

const SideNav: React.FC<SideNavProps> = ({ }) => {

    return (
        <nav className='border h-screen w-44 p-6 flex flex-col'>
            <h1 className='font-black text-2xl tracking-tight text-center pb-5 border-b-2 border-slate-600'>Languages Space</h1>
            <ul className='flex flex-col gap-6 h-full py-7'>
                <Dashboard />
                <Client />
                <Schedule />
                <Supplier />
                <Agent />
                <Admin />
                <Order />
                <Statistics />
                <Web />
                <Settings />
                <Logout />
            </ul>
        </nav>
    );
};

export default SideNav;
