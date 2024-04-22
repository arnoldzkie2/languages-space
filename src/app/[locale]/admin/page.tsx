'use client'
import { DashboardDataProps } from '@/app/api/overview/route';
import SideNav from '@/components/super-admin/SideNav';
import DashboardData from '@/components/super-admin/dashboard/DashboardData';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { SUPERADMIN } from '@/utils/constants';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const Page = () => {

    const session = useSession()

    const [dashboardData, setDashboardData] = useState<DashboardDataProps | null>(null)

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const getDashboardData = async () => {
        try {

            const { data }: { data: { data: DashboardDataProps, ok: boolean } } = await axios.get('/api/overview')

            if (data.ok) return setDashboardData(data.data)

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    useEffect(() => {

        if (session.status === 'authenticated' && session.data.user.type === SUPERADMIN && isAdminAllowed('view_statistics')) {
            getDashboardData()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    return (
        <div className='flex h-screen'>
            <SideNav />
            {dashboardData && isAdminAllowed('view_statistics') ?
                < DashboardData
                    data={dashboardData}
                    getDashboardData={getDashboardData}
                />
                : <HelloWorld />}
        </div>
    )

}

const HelloWorld = () => {

    return (
        <div className='h-screen w-screen grid place-items-center text-2xl font-black'>Hello World HEHE</div>
    )
}

export default Page
