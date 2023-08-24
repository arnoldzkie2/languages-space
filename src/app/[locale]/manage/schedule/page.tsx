/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav';
import { getAllDepartment } from '@/lib/fetchData/department';
import { setDepartments } from '@/lib/redux/GlobalState/GlobalSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface PageProps {

}

const Page: React.FC<PageProps> = ({ }) => {

    const dispatch = useDispatch()

    useEffect(() => {

        const fetchData = async () => {

            const allDepartments = await getAllDepartment()

            dispatch(setDepartments(allDepartments))

        }

        fetchData()
        
    }, [])

    return (
        <>
            <SideNav />
        </>
    );
};

export default Page;
