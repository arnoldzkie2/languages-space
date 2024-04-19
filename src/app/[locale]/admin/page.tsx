'use client'
import { DashboardDataProps } from '@/app/api/overview/route';
import SideNav from '@/components/super-admin/SideNav';
import DashboardData from '@/components/super-admin/dashboard/DashboardData';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { SUPERADMIN } from '@/utils/constants';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const contacts = [
    { name: "Melanie Nabua", phone_number: "9750661533", username: "9750661533", password: "9750661533" },
    { name: "Glenda Mariz Bagtas", phone_number: "09264597099", username: "09264597099", password: "09264597099" },
    { name: "Charlotte Vincent Iurie Y. Escora", phone_number: "09707365661", username: "09707365661", password: "09707365661" },
    { name: "Coleene L. Amdengan", phone_number: "09289004794", username: "09289004794", password: "09289004794" },
    { name: "Giselle Mariano", phone_number: "9560878895", username: "9560878895", password: "9560878895" },
    { name: "Marjorie Natocyad", phone_number: "9976476454", username: "9976476454", password: "9976476454" },
    { name: "Hildah Nkosi", phone_number: "0763231697", username: "0763231697", password: "0763231697" },
    { name: "Rachel Pafin", phone_number: "9277056292", username: "9277056292", password: "9277056292" },
    { name: "Jackilyn Makidato", phone_number: "09505413339", username: "09505413339", password: "09505413339" },
    { name: "Kate Sandig", phone_number: "9068289265", username: "9068289265", password: "9068289265" }
];

const registerSupplier = async () => {
    try {

        await Promise.all(contacts.map(async (sup) => {
            axios.post('/api/supplier', {
                name: sup.name,
                username: sup.username,
                phone_number: sup.phone_number,
                password: sup.password,
                payment_address: sup.phone_number,
                currency: 'PHP',
                booking_rate: 1,
                departments: ['1e3d4b16-576f-4f9f-9d30-a197a3e5ab1d']
            })
        }))

    } catch (error) {
        console.log(error);

    }
}

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
            registerSupplier()
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
