import { DashboardDataProps } from '@/app/api/overview/route'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React from 'react'

interface Props {
    dashboardData: DashboardDataProps
}

const OverviewCards = ({ dashboardData }: Props) => {

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

    const returnChangesFromLastMonth = (percentage: number) => {
        if (percentage > 0) {
            return `+${percentage}% ${t('dashboard.from_last_month')}`
        } else if (percentage === 0) {
            return `${t('dashboard.no_changes')} ${t('dashboard.from_last_month')}`
        } else {
            return `-${percentage}% ${t('dashboard.from_last_month')}`
        }
    }

    const returnCardValue = (value: number, name: string) => {

        if (name === 'total_clients') {
            return value
        }

        if (name === 'total_revenue') {

            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'CNY'
            }).format(value)

        } else if (value === 0) {
            return value
        } else {
            return `+${value}`
        }
    }

    return (
        <div className='flex items-center gap-5 w-full'>
            {dashboardData.dashboardMetrics.map(card => {
                return (
                    <div className='w-full' key={card.name}>
                        <Card>
                            <CardHeader>
                                <div className='flex items-center w-full justify-between'>
                                    <div className='font-normal'>{t(`dashboard.${card.name}`)}</div>
                                    <div className='text-muted-foreground'>
                                        <FontAwesomeIcon icon={card.icon} width={16} height={16} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className='flex flex-col'>
                                <div className='font-bold text-xl'>
                                    {returnCardValue(card.value, card.name)}
                                </div>
                                <small className={returnPercentageColor(card.changePercentage)}>
                                    {returnChangesFromLastMonth(card.changePercentage)}
                                </small>
                            </CardContent>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}

export default OverviewCards