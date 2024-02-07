/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import Success from '@/components/global/Success'
import SideNav from '@/components/super-admin/SideNav'
import ClientHeader from '@/components/super-admin/management/client/ClientHeader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRouter } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import { cn } from '@/utils'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { format, isValid } from 'date-fns'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
    params: {
        cardID: string
        clientID: string
    }
}

const Page = ({ params }: Props) => {

    const router = useRouter()

    const { isSideNavOpen, setIsLoading, setErr, setOkMsg } = useGlobalStore()

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        balance: '',
        validity: ''
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const tt = useTranslations('global')
    const t = useTranslations('super-admin')

    const updateCard = async (e: any) => {
        e.preventDefault()
        const { name, price, balance, validity } = formData
        try {
            setIsLoading(true)
            const { data } = await axios.patch('/api/client/card', { name, price: Number(price), balance: Number(balance), validity }, {
                params: {
                    cardID: params.cardID
                }
            })

            if (data.ok) {
                setIsLoading(false)
                toast('Success! client card updated.')
                router.push(`/admin/manage/client/card/${params.clientID}`)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const retrieveCard = async () => {
        try {
            const { data } = await axios.get('/api/client/card', {
                params: {
                    cardID: params.cardID
                }
            })
            if (data.ok) setFormData(data.data)

        } catch (error) {
            console.log(error);
            alert('Something went wrong')
        }
    }

    useEffect(() => {
        retrieveCard()
    }, [])

    return (
        <div className='h-screen' >
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>
                <ClientHeader />
                <div className='w-full px-8'>
                    <Card className='w-1/4'>
                        <CardHeader>
                            <CardTitle>{t('client-card.update')}</CardTitle>
                            <CardDescription><Err /><Success /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='w-full flex flex-col gap-10' onSubmit={updateCard}>
                                <div className='w-full flex gap-10'>
                                    <div className='w-full flex flex-col gap-4'>
                                        <div className='w-full flex flex-col gap-2'>
                                            <Label htmlFor="name" className='font-medium px-2'>{tt('name')}</Label>
                                            <Input required value={formData.name} onChange={handleChange} name='name' type="text" id='name' />
                                        </div>
                                        <div className='w-full flex flex-col gap-2'>
                                            <label htmlFor="balance" className='font-medium px-2'>{tt('balance')}</label>
                                            <Input value={formData.balance} onChange={handleChange} name='balance' type="number" id='balance' />
                                        </div>
                                        <div className="w-full flex flex-col gap-1.5">
                                            <Label>{t('client-card.validity')}</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left gap-3 font-normal",
                                                            !formData.validity && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <FontAwesomeIcon icon={faCalendar} width={16} height={16} />
                                                        {formData.validity && isValid(new Date(formData.validity))
                                                            ? format(new Date(formData.validity), "PPP")
                                                            : <span>{t('client-card.validity')}</span>
                                                        }
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={new Date(new Date(formData.validity).setHours(0, 0, 0, 0))}
                                                        onSelect={(date) => {
                                                            const adjustedDate = new Date(date!);
                                                            adjustedDate.setHours(0, 0, 0, 0);
                                                            // Check if the adjusted date is valid
                                                            if (!isNaN(adjustedDate.getTime())) {
                                                                const formattedDate = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}`;
                                                                setFormData(prev => ({ ...prev, validity: formattedDate }))
                                                            } else {
                                                                // If the date is not valid, set validity to an empty string
                                                                setFormData(prev => ({ ...prev, validity: '' }))
                                                            }
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-10 w-full'>
                                    <Button
                                        className='w-full'
                                        type='button'
                                        variant={'ghost'}
                                        onClick={() => router.push(`/admin/manage/client/card/${params.clientID}`)}>{tt('cancel')}</Button>
                                    <SubmitButton msg={tt('update')} style='w-full' />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default Page