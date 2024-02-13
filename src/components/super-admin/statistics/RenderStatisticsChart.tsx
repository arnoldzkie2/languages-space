import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import React from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Props {
    capitalizeFirstLetter: (str: string) => string
    currentChart: string
    chartData: any[]
    dateFormat: string
    setDateFormat: React.Dispatch<React.SetStateAction<string>>
    availableDateFormat: string[]
}

const RenderStatisticsChart = ({ currentChart, availableDateFormat, capitalizeFirstLetter, dateFormat, chartData, setDateFormat }: Props) => {

    const { theme } = useTheme()

    const isLightTheme = theme === 'light' ? true : false

    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                        <div>
                            {capitalizeFirstLetter(currentChart)} - {capitalizeFirstLetter(dateFormat)}
                        </div>
                        <div className='flex items-center gap-3'>
                            {availableDateFormat.map(date => (
                                <Button key={date}
                                    onClick={() => setDateFormat(date)}
                                    variant={date === dateFormat ? 'default' : 'secondary'}>{capitalizeFirstLetter(date)}</Button>
                            ))}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width={'100%'} height={380}>
                        <LineChart
                            width={500}
                            height={300}
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <XAxis
                                dataKey="x"
                                axisLine={false}
                                tickLine={false}
                                stroke={theme === 'light' ? '#333' : '#aaa'} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                stroke={theme === 'light' ? '#333' : '#aaa'} />
                            <Tooltip
                                labelStyle={{
                                    color: isLightTheme ? '#333' : '#aaa'
                                }}
                                contentStyle={{
                                    backgroundColor: isLightTheme ? '#fff' : '#333',
                                    borderRadius: '10px',
                                    border: 'none'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="now" stroke={isLightTheme ? '#000' : '#fff'} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="prev" stroke={isLightTheme ? '#bbb' : '#aaa'} opacity={'30%'} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default RenderStatisticsChart