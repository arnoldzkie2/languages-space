'use client'
import React, { useState } from 'react'
import { DashboardDataProps } from '@/app/api/overview/route';
import useGlobalStore from '@/lib/state/globalStore';
import DashboardHeader from './DashboardHeader';
import OverviewCards from './OverviewCards';
import RenderChart from './RenderChart';
import RenderMostDataLastMonth from './RenderMostDataLastMonth';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import RenderMostDataThisMonth from './RenderMostDataThisMonth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
    data: DashboardDataProps | null
    getDashboardData: () => Promise<void>
}

const DashboardData = ({ data, getDashboardData }: Props) => {

    const { isSideNavOpen } = useGlobalStore()

    const [chartName, setChartName] = useState('revenue')

    const availableChart = ['client', 'booking', 'order', 'revenue']

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const t = useTranslations()
    if (!data) return null

    const mostDataSkeleton = (
        <div className='flex items-center gap-4'>
            <Avatar className='border'>
                <AvatarImage src={''} alt='Profile' />
                <AvatarFallback><FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /></AvatarFallback>
            </Avatar>
            <div className='flex flex-col w-full gap-1'>
                <Skeleton className='h-4 w-28 rounded-md' />
                <div className='flex items-center justify-between w-full'>
                    <Skeleton className='h-4 w-44' />
                    <Skeleton className='w-28 h-4' />
                </div>
            </div>
        </div>
    )

    return (
        <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

            <DashboardHeader />
            <div className='flex flex-col w-full px-8 items-center justify-center gap-4'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-2xl font-black'>{t('dashboard.overview')}</h1>
                    <div className='flex items-center gap-5'>
                        <Button onClick={() => toast("This function is not yeat ready.")}>{t('operation.download')}</Button>
                    </div>
                </div>
                <ul className='flex bg-muted items-center self-start py-1 px-1 rounded-md text-muted-foreground gap-5 text-sm'>
                    {availableChart.map(chart => (
                        <li key={chart}
                            onClick={() => setChartName(chart)}
                            className={`px-2 py-1 ${chart === chartName ? 'bg-card rounded-md shadow text-foreground' : ' opacity-40'} cursor-pointer`}>
                            {capitalizeFirstLetter(chart)}
                        </li>
                    ))}
                </ul>
                <OverviewCards dashboardData={data} />
                <div className='w-full flex items-center gap-5'>
                    <RenderChart currentChart={chartName} capitalizeFirstLetter={capitalizeFirstLetter} />
                    <RenderMostDataLastMonth data={data} mostDataSkeleton={mostDataSkeleton} />
                    <RenderMostDataThisMonth data={data} mostDataSkeleton={mostDataSkeleton} />
                </div>
            </div>
        </div>
    )
}

export default DashboardData