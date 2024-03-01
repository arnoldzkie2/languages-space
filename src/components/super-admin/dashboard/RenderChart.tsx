import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

interface Props {
    currentChart: string
    capitalizeFirstLetter: (str: string) => string
}

const RenderChart: React.FC<Props> = ({ currentChart, capitalizeFirstLetter }) => {

    const [chartData, setChartData] = useState([])

    const { theme } = useTheme()

    const getCurrentChart = async () => {
        try {

            const { data } = await axios.get('/api/overview/chart', {
                params: { chart: currentChart }
            })

            if (data.ok) setChartData(data.data)

        } catch (error) {
            setChartData([])
            console.log(error);
            alert("Something went wrong")
        }
    }

    const isLightTheme = theme === 'light' ? true : false

    useEffect(() => {
        getCurrentChart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChart])

    const t = useTranslations()
    return (
        <div className='w-1/2'>
            <Card>
                <CardHeader>
                    <CardTitle>{capitalizeFirstLetter(currentChart)} {t("statistics.week.this")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width={'100%'} height={380}>
                        <BarChart data={chartData}>

                            <XAxis
                                dataKey={'day'}
                                fontSize={11}
                                stroke={isLightTheme ? '#333' : '#ddd'}
                                fill={isLightTheme ? '#333' : '#ddd'}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                fontSize={11}
                                stroke={isLightTheme ? '#333' : '#ddd'}
                                fill={isLightTheme ? '#333' : '#ddd'}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Bar dataKey={'total'} radius={[5, 5, 0, 0]}
                                fill={isLightTheme ? '#333' : '#ddd'}
                                label={{
                                    position: 'top',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    fill: isLightTheme ? '#333' : '#ddd'
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default RenderChart