'use client'
import SideNav from '@/components/super-admin/SideNav';
import Pagination from '@/components/super-admin/management/Pagination';
import { ClientCardSearchQueryValue } from '@/lib/redux/ClientCard/DefaultValues';
import { setDepartments } from '@/lib/redux/GlobalState/GlobalSlice';
import { RootState } from '@/lib/redux/Store';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ClientCard: React.FC = ({ }) => {

    const dispatch = useDispatch()

    const { currentPage, isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    const [searchQuery, setSearchQuery] = useState(ClientCardSearchQueryValue)

    const getAllDepartment = async () => {

        try {

            const { data } = await axios.get('/api/department')

            if (data.success) {

                return dispatch(setDepartments(data.data))

            }

            alert('Something went wrong')

        } catch (error) {

            console.log(error);
        }
    }

    const filteredCard: any = []

    const itemsPerPage = 10

    const indexOfLastItem = currentPage * itemsPerPage

    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentClients = filteredCard.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(filteredCard.length / itemsPerPage)

    return (
        <div className='flex bg-slate-50'>
            <SideNav />

            <div className={`flex flex-col w-full ${isSideNavOpen ? 'p-5 gap-5' : 'px-10 py-5'}`}>

                <nav className={`border shadow flex items-center py-5 px-10 h-24 justify-between`}>
                    <h1 className='font-bold text-gray-600 text-xl'>MANAGE CARD</h1>
                    <ul className='flex items-center gap-10 h-full ml-auto'>
                    </ul>
                </nav>

                <Pagination total={filteredCard} getTotalPages={getTotalPages} />
            </div>
        </div>
    )
};

export default ClientCard;
function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}

