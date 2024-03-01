import { DashboardDataProps } from '@/app/api/overview/route'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React from 'react'

interface Props {
    dashboardData: DashboardDataProps
}

const OverviewCards = ({ dashboardData }: Props) => {

    const t = useTranslations()

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

        const fixedPercentage = percentage.toFixed(2)
        if (percentage > 0) {
            return `+${fixedPercentage}% ${t('statistics.month.from_last')}`
        } else if (percentage === 0) {
            return `${t('statistics.no_changes')} ${t('statistics.month.from_last')}`
        } else {
            return `-${fixedPercentage}% ${t('statistics.month.from_last')}`
        }
    }

    const returnCardValue = (value: number, name: string) => {

        if (name === 'client') {
            return value
        }

        if (name === 'revenue') {

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
                                    <div className='font-normal'>{t(`statistics.total.${card.name}`)}</div>
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