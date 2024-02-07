'use client'
import useClientBookingStore from '@/lib/state/client/clientBookingStore'
import useClientCardStore from '@/lib/state/client/clientCardStore'
/* eslint-disable react-hooks/exhaustive-deps */
import useClientStore from '@/lib/state/client/clientStore'
import useAdminBookingStore, { bookingFormDataValue } from '@/lib/state/super-admin/bookingStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const AvailableSuppliers = () => {

    const router = useRouter()

    const { availableSupplier, client, getAvailableSupplier } = useClientStore()
    const cards = useClientCardStore(state => state.cards)
    const getCards = useClientCardStore(state => state.getCards)
    const { openBookingModal, closeBookingModal, openBookingRequestModal, closeBookingRequestModal } = useClientBookingStore(state => state)
    const { bookingFormData, setBookingFormData } = useAdminBookingStore()
    const { getCardCourses } = useAdminSupplierStore()
    const [searchQuery, setSearchQery] = useState('')
    const skeleton = [1, 2, 3, 4, 5, 6]
    const [maxVisibleItems, setMaxVisibleItems] = useState(6)
    const [openCard, setOpenCard] = useState(false)

    const filterSupplier = availableSupplier && availableSupplier.filter(sup => sup.supplier.name.toUpperCase().includes(searchQuery.toUpperCase()))

    useEffect(() => {
        setBookingFormData(bookingFormDataValue)
        if (client?.id && !cards) getCards()
    }, [client?.id])

    useEffect(() => {

        if (bookingFormData.clientCardID && client?.id) {
            getAvailableSupplier(bookingFormData.clientCardID)
            getCardCourses(bookingFormData.clientCardID)
        }

    }, [bookingFormData.clientCardID])

    useEffect(() => {
        closeBookingModal()
        closeBookingRequestModal()
    }, [])

    const t = useTranslations('client')
    const tt = useTranslations('global')
    const ttt = useTranslations('super-admin')

    return (
        <div className='padding py-28 flex flex-col items-center'>
            <Card className='w-full flex flex-col sm:shadow 2xl:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Make Your Reservation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex w-full items-center gap-5 pb-5'>
                        <div className='flex w-full sm:w-1/2 md:w-1/4'>
                            <Popover open={openCard} onOpenChange={setOpenCard}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCard}
                                        className={cn(
                                            "w-full justify-between",
                                            !bookingFormData.clientCardID && "text-muted-foreground"
                                        )}
                                    >
                                        {bookingFormData.clientCardID
                                            ? cards && cards.find((card) => card.id === bookingFormData.clientCardID)?.name
                                            : ttt('client-card.select')}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder={ttt('client-card.search')}
                                            className="h-9"
                                        />
                                        <CommandEmpty>{ttt('client-card.404')}</CommandEmpty>
                                        <CommandGroup>
                                            {cards && cards.length > 0 ? cards.map(card => (
                                                <CommandItem
                                                    key={card.id}
                                                    className={`${bookingFormData.clientCardID === card.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    value={card.name}
                                                    onSelect={() => {
                                                        setBookingFormData({ ...bookingFormData, clientCardID: card.id })
                                                        setOpenCard(false)
                                                    }}
                                                >
                                                    {card.name}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            bookingFormData.clientCardID === card.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            )) : <CommandItem value='buy' onSelect={() => { router.push('/client/buy') }}>{t('card.buy')}</CommandItem>}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='w-full sm:w-1/2 md:w-1/4 relative'>
                            <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-2.5 sm:right-2 top-2.5 sm:top-2.5' />
                            <Input type="text" value={searchQuery}
                                onChange={(e) => setSearchQery(e.target.value)}
                                placeholder={ttt('supplier.search')} name='name'
                                className='w-full'
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-wrap gap-8 justify-evenly'>
                        {filterSupplier && filterSupplier.length > 0 && bookingFormData.clientCardID ? filterSupplier.map(supplierPrice => (
                            <div className='shadow rounded-md relative border w-full max-h-96 min-h-[384px] sm:w-80 overflow-y-auto bg-card items-center flex flex-col pb-3 p-5 gap-2' key={supplierPrice.supplier.id}>
                                <div className='flex w-full flex-col items-center gap-2'>
                                    <Image width={90} height={90} className='w-[90px] min-w-[90px] min-h-[90px] border max-w-[90px] max-h-[90px] object-cover h-[90px] rounded-full' src={supplierPrice.supplier.profile_url || '/profile/profile.svg'} alt='Supplier Profile' />
                                    <h1 className='h-7 px-5 text-xl text-center w-full font-black uppercase'>{supplierPrice.supplier.name}</h1>
                                </div>
                                <ul className='flex w-full flex-wrap gap-3 border-t pt-3'>
                                    {supplierPrice.supplier.tags.length > 0 && supplierPrice.supplier.tags.map((tag) => (
                                        <li key={tag} className='bg-secondary text-muted-foreground px-2 py-0.5 text-sm'>{tag}</li>
                                    ))}
                                </ul>
                                <div className='w-full flex flex-col gap-3 justify-between'>
                                    <div className='flex items-center gap-2 w-full mt-5'>{tt('price')}: <span className='text-primary font-bold'>{supplierPrice.price}</span></div>
                                    <div className='w-full flex items-center gap-5'>
                                        <Button
                                            variant={'secondary'}
                                            onClick={() => {
                                                setBookingFormData({ ...bookingFormData, supplierID: supplierPrice.supplier.id })
                                                openBookingRequestModal()
                                            }}
                                        >{t('booking.request')}</Button>
                                        {supplierPrice.supplier.schedule.length > 0 && <Button onClick={() => {
                                            setBookingFormData({ ...bookingFormData, supplierID: supplierPrice.supplier.id })
                                            openBookingModal()
                                        }}>{t('header.book-now')}</Button>}
                                    </div>
                                </div>
                            </div>
                        ))
                            : !bookingFormData.clientCardID ? <div className='py-20'>{t('booking.select-card')}</div> : bookingFormData.clientCardID && availableSupplier && !availableSupplier.length
                                ? <div className='py-20'>{t('booking.no-supplier')}</div>
                                : skeleton.map(item => (
                                    <div className='shadow rounded-md relative border w-full max-h-96 min-h-[384px] sm:w-80 overflow-y-auto bg-card items-center flex flex-col pb-3 p-5 gap-2' key={item}>
                                        <div className='flex w-full flex-col items-center gap-2'>
                                            <Skeleton className='border max-w-[90px] w-[90px] h-[90px] rounded-full'></Skeleton>
                                            <Skeleton className=' h-7 w-36'></Skeleton>
                                        </div>
                                        <ul className='flex w-full flex-wrap gap-3 border-t pt-3'>
                                            <Skeleton className='w-16 h-5 text-sm'></Skeleton>
                                            <Skeleton className='w-16 h-5 text-sm'></Skeleton>
                                            <Skeleton className='w-16 h-5 text-sm'></Skeleton>
                                            <Skeleton className='w-20 h-5 text-sm'></Skeleton>
                                            <Skeleton className='w-20 h-5 text-sm'></Skeleton>
                                            <Skeleton className='w-32 h-5 text-sm'></Skeleton>
                                        </ul>
                                        <div className='w-full flex flex-col gap-3 justify-between'>
                                            <Skeleton className='w-24 h-5' />
                                            <div className='w-full flex items-center gap-5'>
                                                <Skeleton className='h-7 w-20 '></Skeleton>
                                                <Skeleton className='w-28 rounded-sm h-7'></Skeleton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </CardContent>
            </Card>
            {filterSupplier && filterSupplier.length > maxVisibleItems && (
                <Button onClick={() => setMaxVisibleItems((prevState) => prevState + 6)}>
                    {tt('show-more')}
                </Button>)}
        </div >
    )
}

export default AvailableSuppliers