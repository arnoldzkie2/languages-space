/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientCardStore from '@/lib/state/client/clientCardStore'
import useClientStore from '@/lib/state/client/clientStore'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '../ui/select'
import SubmitButton from '../global/SubmitButton'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const AvailableCards = () => {

    const router = useRouter()

    const [searchQuery, setSearchQery] = useState('')
    const [maxVisibleItems, setMaxVisibleItems] = useState(6);

    const client = useClientStore(s => s.client)
    const { availableCards, getAvailableCardsToBuy, checkoutCard } = useClientCardStore()

    const skeleton = [1, 2, 3, 4, 5, 6]

    const filterCards = availableCards && availableCards.filter(card => card.name.toUpperCase().includes(searchQuery.toUpperCase())).slice(0, maxVisibleItems)

    const t = useTranslations()

    useEffect(() => {
        if (client?.id && !availableCards) getAvailableCardsToBuy()
    }, [client?.id])

    return (
        <div className='padding py-28 flex flex-col items-center text-muted-foreground'>
            <Card className='w-full sm:bg-card sm:shadow 2xl:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-3xl'>{t("client.page.card.h1")}</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-5'>
                    <div className='w-full sm:w-1/2 md:w-1/4 relative'>
                        <Label htmlFor='search-card'>
                            <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer' />
                        </Label>
                        <Input id='search-card' value={searchQuery} onChange={(e) => setSearchQery(e.target.value)} placeholder={t('card.search')} />
                    </div>
                    <div className='w-full flex gap-5 items-center justify-evenly flex-wrap'>
                        {filterCards && filterCards.length > 0 ? filterCards.map(card => (
                            <form className='shadow w-full sm:w-72 h-auto border bg-card flex flex-col gap-2.5 p-5' key={card.id} onSubmit={(e) => checkoutCard(e, card.id, router)}>
                                <h1 className='text-foreground border-b pb-2 text-xl font-black uppercase'>{card.name}</h1>
                                <div className='flex items-center justify-between'>
                                    <small className='h-5'>{t('card.validity')}: {card.validity} {t('card.days')}</small>
                                    <small className='h-5'>{t('balance.h1')}: {card.balance}</small>
                                </div>
                                <div className="w-full items-center">
                                    <Select>
                                        <SelectTrigger>
                                            {t('card.supported.courses')}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {card.supported_courses.map(course => (
                                                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full items-center">
                                    <Select>
                                        <SelectTrigger>
                                            {t('card.supported.suppliers')}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {card.supported_suppliers.map(supplier => (
                                                    <SelectItem key={supplier.id} value={supplier.id}>{supplier.supplier.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='w-full flex justify-between items-center'>
                                    <Label className='flex items-center font-normal gap-2'>{t('card.price')}: <span className='text-primary font-bold'>¥{card.price}</span></Label>
                                    <SubmitButton msg={t('card.buy')} />
                                </div>
                            </form>
                        ))
                            : searchQuery && filterCards && filterCards.length === 0 ? <div>{t("card.404")}</div> : skeleton.map(item => (
                                <div className='border shadow w-full bg-card sm:w-72 h-60 flex flex-col gap-2 p-5' key={item}>
                                    <Skeleton className='border-b pb-2 w-44 h-8 rounded-md'></Skeleton>
                                    <div className='flex items-center justify-between'>
                                        <Skeleton className='h-5 w-24 rounded-md'></Skeleton>
                                        <Skeleton className='h-5 w-24 rounded-md'></Skeleton>
                                    </div>
                                    <Skeleton className='h-5 w-full rounded-md'></Skeleton>
                                    <Skeleton className='h-5 w-full rounded-md'></Skeleton>
                                    <div className='w-full flex justify-between mt-auto gap-4'>
                                        <Skeleton className='w-1/2 h-7 rounded-md'></Skeleton>
                                        <Skeleton className='px-5 h-7 rounded-md w-1/3'></Skeleton>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {availableCards && availableCards.length > maxVisibleItems && (
                        <button
                            onClick={() => setMaxVisibleItems((prevState) => prevState + 6)}
                            className='text-muted-foreground hover:text-primary cursor-pointer mt-5'
                        >
                            {t('operation.show_more')}
                        </button>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}

export default AvailableCards