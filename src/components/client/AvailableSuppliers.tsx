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

    const ttt = useTranslations('super-admin')

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

    return (
        <div className='padding py-28 flex flex-col items-center text-slate-600'>
            <div className='w-full flex flex-col gap-5 sm:bg-white sm:p-5 sm:shadow 2xl:w-1/2'>
                <div className='flex w-full items-center gap-5'>
                    <select value={bookingFormData.clientCardID} name='clientCardID' onChange={(e) => {
                        if (e.target.value === 'buy') {
                            return router.push('/client/buy')
                        }
                        setBookingFormData({ ...bookingFormData, clientCardID: e.target.value })
                    }
                    }
                        className='px-2 outline-none w-1/2 py-1.5 sm:py-2 text-sm bg-white border'>
                        <option value="" disabled>{ttt('client-card.select')}</option>
                        {cards && cards.length > 0 ? cards.map(card => (
                            <option value={card.id} key={card.id}>{card.name} ({card.balance})</option>
                        )) : cards && cards.length === 0 ?
                            <>
                                <option disabled>{t('card.no-card')}</option>
                                <option value='buy'>{t('card.buy')}</option>
                            </>
                            : <option disabled className='flex items-center gap-2'>{t('card.getting')}</option>}
                    </select>
                    <div className='w-full relative'>
                        <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-2.5 sm:right-2 top-2.5 sm:top-3 text-slate-600' />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQery(e.target.value)} placeholder={ttt('supplier.search')} name='name' className='py-1 sm:py-1.5 px-3 pr-8 border w-full outline-none' />
                    </div>
                </div>
                <div className='w-full flex flex-wrap gap-8 justify-evenly'>
                    {availableSupplier && availableSupplier.length > 0 && bookingFormData.clientCardID ? availableSupplier.map(supplierPrice => (
                        <div className='shadow rounded-md relative border hover:shadow-lg w-full max-h-96 min-h-[384px] sm:w-80 overflow-y-auto bg-white items-center flex flex-col pb-3 p-5 gap-2' key={supplierPrice.supplier.id}>
                            <Image width={125} height={125} className='w-[125px] min-w-[125px] min-h-[125px] border max-w-[125px] max-h-[125px] object-cover h-[125px] rounded-full' src={supplierPrice.supplier.profile_url || '/profile/profile.svg'} alt='Supplier Profile' />
                            <h1 className='text-slate-700 h-7 px-5 text-center font-black uppercase'>{supplierPrice.supplier.name}</h1>
                            <ul className='flex w-full flex-wrap gap-3 justify-center border-t pt-3'>
                                {supplierPrice.supplier.tags.length > 0 && supplierPrice.supplier.tags.map((tag) => (
                                    <li key={tag} className='bg-slate-100 px-2 py-0.5 text-sm'>{tag}</li>
                                ))}
                            </ul>
                            <div className='flex items-center gap-2 w-full'>{tt('price')}: <span className='text-blue-600 font-black'>{supplierPrice.price}</span></div>
                            <div className='absolute right-0 bottom-0 w-full flex items-center h-16 px-5 border-t justify-between'>
                                <Button
                                    variant={'secondary'}
                                    onClick={() => {
                                        setBookingFormData({ ...bookingFormData, supplierID: supplierPrice.supplier.id })
                                        openBookingRequestModal()
                                    }}
                                    className='border text-muted-foreground'>{t('booking.request')}</Button>
                                {supplierPrice.supplier.schedule.length > 0 && <Button onClick={() => {
                                    setBookingFormData({ ...bookingFormData, supplierID: supplierPrice.supplier.id })
                                    openBookingModal()
                                }}>{t('header.book-now')}</Button>}
                            </div>
                        </div>
                    ))
                        : !bookingFormData.clientCardID ? <div className='py-20'>{t('booking.select-card')}</div> : bookingFormData.clientCardID && availableSupplier && !availableSupplier.length
                            ? <div className='py-20'>{t('booking.no-supplier')}</div>
                            : skeleton.map(item => (
                                <div className='shadow rounded-md relative border w-full max-h-96 min-h-[384px] sm:w-80 overflow-y-auto bg-white items-center flex flex-col pb-3 p-5 gap-2' key={item}>
                                    <div className='border max-w-[125px] w-[125px] h-[125px] rounded-full bg-slate-100 animate-pulse'></div>
                                    <h1 className='bg-slate-200 h-7 w-36 animate-pulse'></h1>
                                    <ul className='flex w-full flex-wrap gap-3 justify-center border-t pt-3'>
                                        <li className='bg-slate-100 w-16 animate-pulse h-5 text-sm'></li>
                                        <li className='bg-slate-100 w-16 animate-pulse h-5 text-sm'></li>
                                        <li className='bg-slate-100 w-16 animate-pulse h-5 text-sm'></li>
                                        <li className='bg-slate-100 w-20 animate-pulse h-5 text-sm'></li>
                                        <li className='bg-slate-100 w-20 animate-pulse h-5 text-sm'></li>
                                        <li className='bg-slate-100 w-32 animate-pulse h-5 text-sm'></li>
                                    </ul>
                                    <div className='absolute right-0 bottom-0 w-full flex items-center h-16 px-5 border-t justify-between'>
                                        <div className='h-5 w-20 bg-slate-200'></div>
                                        <button className='bg-blue-300 animate-pulse w-28 rounded-sm h-7'></button>
                                    </div>
                                </div>
                            ))}
                </div>

            </div>
            {
                availableSupplier && availableSupplier.length > maxVisibleItems && (
                    <button
                        onClick={() => setMaxVisibleItems((prevState) => prevState + 6)}
                        className='text-blue-600 hover:text-blue-500 cursor-pointer mt-5'
                    >
                        {tt('show-more')}
                    </button>
                )
            }

        </div >
    )
}

export default AvailableSuppliers