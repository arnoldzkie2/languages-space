'use client'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import StatisticsHeader from './StatisticsHeader'
import useGlobalStore from '@/lib/state/globalStore'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import OverviewStatisticsCard from './OverviewStatisticsCard'
import { OverviewCards } from '@/app/api/overview/statistics/route'
import RenderStatisticsChart from './RenderStatisticsChart'
import { StatisticsChartData } from '@/app/api/overview/statistics/chart/route'
import { toast } from 'sonner'

const StatisticsData = () => {

    const { isSideNavOpen } = useGlobalStore()
    const [chartData, setChartData] = useState<StatisticsChartData[]>([])
    const [cardsData, setCardsData] = useState<OverviewCards | null>(null)

    const [dateFormat, setDateFormat] = useState('week')
    const [currentChart, setCurrentChart] = useState('revenue')
    const [prevCurrentChart, setPrevCurrentChart] = useState('')
    const [prevDateFormat, setPrevDateFormat] = useState('')
    const availableDateFormat = ['year', 'month', 'week']
    const availableChart = ['client', 'supplier', 'agent', 'booking', 'order', 'revenue']

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const t = useTranslations()

    const getCardsData = async () => {
        try {

            const { data } = await axios.get("/api/overview/statistics", {
                params: {
                    currentView: currentChart
                }
            })
            if (data.ok) setCardsData(data.data)

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    const getChartData = async () => {
        try {
            const { data } = await axios.get("/api/overview/statistics/chart", {
                params: { currentChart, dateFormat }
            })
            if (data.ok) setChartData(data.data)

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }
    useEffect(() => {
        if (prevCurrentChart !== currentChart) {
            getChartData();
            getCardsData();
        } else if (prevDateFormat !== dateFormat) {
            getChartData();
        }
        // Update previous values
        setPrevCurrentChart(currentChart);
        setPrevDateFormat(dateFormat);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChart, dateFormat]);
    return (
        <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

            <StatisticsHeader />
            <div className='flex flex-col w-full px-52 items-center justify-center gap-4'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-2xl font-black'>{t('dashboard.overview')}</h1>
                    <div className='flex items-center gap-5'>
                        <Button onClick={()=> toast("This function is not yet ready")}>Download</Button>
                    </div>
                </div>
                <ul className='flex bg-muted items-center self-start py-1 px-1 rounded-md text-muted-foreground gap-5 text-sm'>
                    {availableChart.map(chart => (
                        <li key={chart}
                            onClick={() => setCurrentChart(chart)}
                            className={`px-2 py-1 ${chart === currentChart ? 'bg-card rounded-md shadow text-foreground' : ' opacity-40'} cursor-pointer`}>
                            {capitalizeFirstLetter(chart)}
                        </li>
                    ))}
                </ul>
                <OverviewStatisticsCard data={cardsData} />
                <div className='w-full flex items-center gap-5'>
                    <RenderStatisticsChart
                        currentChart={currentChart}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                        chartData={chartData}
                        dateFormat={dateFormat}
                        availableDateFormat={availableDateFormat}
                        setDateFormat={setDateFormat}
                    />
                    {/* <RenderMostDataLastMonth data={data} mostDataSkeleton={mostDataSkeleton} /> */}
                    {/* <RenderMostDataThisMonth data={data} mostDataSkeleton={mostDataSkeleton} /> */}
                </div>
            </div>
        </div>)
}

export default StatisticsData