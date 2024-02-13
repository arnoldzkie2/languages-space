import { DashboardDataProps } from '@/app/api/overview/route'
import { OverviewCards } from '@/app/api/overview/statistics/route'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React from 'react'

interface Props {
    data: OverviewCards | null
}

const OverviewStatisticsCard = ({ data }: Props) => {

    const t = useTranslations("super-admin")

    const returnPercentageColor = (percentage: number) => {
        if (percentage > 0) {
            return 'text-primary'
        } else if (percentage === 0) {
            return 'text-muted-foreground'
        } else {
            return 'text-destructive'
        }
    }

    const returnChangesFromLastWeek = (percentage: number) => {

        const fixedPercentage = percentage.toFixed(2)

        if (percentage > 0) {
            return `+${fixedPercentage}% ${t('dashboard.from_last_week')}`
        } else if (percentage === 0) {
            return `${t('dashboard.no_changes')} ${t('dashboard.from_last_week')}`
        } else {
            return `-${fixedPercentage}% ${t('dashboard.from_last_week')}`
        }

    }

    const returnChangesFromLastMonth = (percentage: number) => {

        const fixedPercentage = percentage.toFixed(2)

        if (percentage > 0) {
            return `+${fixedPercentage}% ${t('dashboard.from_last_month')}`
        } else if (percentage === 0) {
            return `${t('dashboard.no_changes')} ${t('dashboard.from_last_month')}`
        } else {
            return `-${fixedPercentage}% ${t('dashboard.from_last_month')}`
        }
    }

    const returnChangeFromLastYear = (percentage: number) => {

        const fixedPercentage = percentage.toFixed(2)

        if (percentage > 0) {
            return `+${fixedPercentage}% ${t('dashboard.from_last_year')}`
        } else if (percentage === 0) {
            return `${t('dashboard.no_changes')} ${t('dashboard.from_last_year')}`
        } else {
            return `-${fixedPercentage}% ${t('dashboard.from_last_year')}`
        }
    }

    return (
        <div className='flex items-center gap-5 w-full'>

            {/* total */}
            {data ? <div className='w-full'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center w-full justify-between'>
                            <div className='font-normal'>{t(`statistics.total.${data.name}`)}</div>
                            <div className='text-muted-foreground'>
                                <FontAwesomeIcon icon={data.icon} width={16} height={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col'>
                        <div className='font-bold text-xl'>
                            {data.name === 'revenue' ? `CN¥ ${data.total.toLocaleString()}` : data.total}
                        </div>
                        <small className={returnPercentageColor(data.oneMonthChange)}>
                            {returnChangesFromLastMonth(data.oneMonthChange)}
                        </small>
                    </CardContent>
                </Card>
            </div> : <SkeletonCard />}

            {/* this year */}
            {data ? <div className='w-full'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center w-full justify-between'>
                            <div className='font-normal'>{t(`statistics.this.year`)}</div>
                            <div className='text-muted-foreground'>
                                <FontAwesomeIcon icon={data.icon} width={16} height={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col'>
                        <div className='font-bold text-xl'>
                            +{data.thisYear}
                        </div>
                        <small className={returnPercentageColor(data.oneYearChange)}>
                            {returnChangeFromLastYear(data.oneYearChange)}
                        </small>
                    </CardContent>
                </Card>
            </div> : <SkeletonCard />}

            {/* this month */}
            {data ? <div className='w-full'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center w-full justify-between'>
                            <div className='font-normal'>{t(`statistics.this.month`)}</div>
                            <div className='text-muted-foreground'>
                                <FontAwesomeIcon icon={data.icon} width={16} height={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col'>
                        <div className='font-bold text-xl'>
                            +{data.thisMonth}
                        </div>
                        <small className={returnPercentageColor(data.oneMonthChange)}>
                            {returnChangesFromLastMonth(data.oneMonthChange)}
                        </small>
                    </CardContent>
                </Card>
            </div> : <SkeletonCard />}

            {/* this week */}
            {data ? <div className='w-full'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center w-full justify-between'>
                            <div className='font-normal'>{t(`statistics.this.week`)}</div>
                            <div className='text-muted-foreground'>
                                <FontAwesomeIcon icon={data.icon} width={16} height={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col'>
                        <div className='font-bold text-xl'>
                            +{data.thisWeek}
                        </div>
                        <small className={returnPercentageColor(data.oneWeekChange)}>
                            {returnChangesFromLastWeek(data.oneWeekChange)}
                        </small>
                    </CardContent>
                </Card>
            </div> : <SkeletonCard />}

        </div>
    )
}

const SkeletonCard = () => {
    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <div className='flex items-center w-full justify-between'>
                        <Skeleton className='h-7 w-36' />
                        <div className='text-muted-foreground'>
                            <Skeleton className='w-10 h-7' />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>
                    <Skeleton className='h-7 w-36' />
                    <Skeleton className='h-4 w-52' />
                </CardContent>
            </Card>
        </div>
    )
}

export default OverviewStatisticsCard