'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import useClientStore, { bookingFormDataValue } from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const AvailableSuppliers = () => {

    const { cards, getClientCards, availableSupplier, getAvailableSupplier, clearAvailableSuppliers, openBookingModal, bookingFormData, setBookingFormData } = useClientStore()
    const { setCardCourses } = useAdminSupplierStore()
    const [searchQuery, setSearchQery] = useState('')
    const skeleton = [1, 2, 3, 4, 5, 6]
    const [maxVisibleItems, setMaxVisibleItems] = useState(6)

    const ttt = useTranslations('super-admin')

    const getCardCourses = async () => {
        try {

            const { data } = await axios.get('/api/courses', {
                params: { cardID: bookingFormData.clientCardID }
            })

            if (data.ok) setCardCourses(data.data)

        } catch (error: any) {
            console.log(error)
            if (error.response.data.msg) {
                alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }


    useEffect(() => {
        setBookingFormData(bookingFormDataValue)
        clearAvailableSuppliers()
        if (!cards) getClientCards()
    }, [])

    useEffect(() => {

        if (bookingFormData.clientCardID) {
            getAvailableSupplier(bookingFormData.clientCardID)
            getCardCourses()
        }

    }, [bookingFormData.clientCardID])

    const t = useTranslations('client')
    const tt = useTranslations('global')

    return (
        <div className='padding py-28 flex flex-col items-center text-slate-600'>
            <div className='w-full flex flex-col gap-5 sm:bg-white sm:p-5 sm:shadow 2xl:w-1/2'>
                <div className='flex w-full items-center gap-5'>
                    <select value={bookingFormData.clientCardID} name='clientCardID' onChange={(e) => setBookingFormData({ ...bookingFormData, clientCardID: e.target.value })} className='px-2 outline-none py-1.5 sm:py-2 text-sm bg-white border'>
                        <option value="" disabled>{ttt('client-card.select')}</option>
                        {cards && cards.length > 0 ? cards.map(card => (
                            <option value={card.id} key={card.id}>{card.name} ({card.balance})</option>
                        )) : ''}
                    </select>
                    <div className='w-full relative'>
                        <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-2.5 sm:right-2 top-2.5 sm:top-3 text-slate-600' />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQery(e.target.value)} placeholder={ttt('supplier.search')} name='name' className='py-1 sm:py-1.5 px-3 pr-8 border w-full outline-none' />
                    </div>
                </div>
                <div className='w-full flex flex-wrap gap-8 justify-evenly'>
                    {availableSupplier && availableSupplier.length > 0 ? availableSupplier.map(supplierPrice => (
                        <div onClick={() => openBookingModal({ ...bookingFormData, supplierID: supplierPrice.supplier.id })} className='shadow rounded-md relative border hover:shadow-lg cursor-pointer w-full max-h-96 min-h-[384px] sm:w-80 overflow-y-auto bg-white items-center flex flex-col pb-3 p-5 gap-2' key={supplierPrice.supplier.id}>
                            <Image width={125} height={125} className='w-[125px] min-w-[125px] min-h-[125px] bg-cover object-cover h-[125px] rounded-full' src={supplierPrice.supplier.profile_url || '/profile/profile.svg'} alt='Supplier Profile' />
                            <h1 className='text-slate-700 h-8 px-5 text-center font-black uppercase'>{supplierPrice.supplier.name}</h1>
                            <ul className='flex w-full flex-wrap gap-3 justify-center border-t pt-3'>
                                {supplierPrice.supplier.tags.length > 0 && supplierPrice.supplier.tags.map((tag) => (
                                    <li key={tag} className='bg-slate-100 px-2 py-0.5 text-sm'>{tag}</li>
                                ))}
                            </ul>
                            <div className='absolute right-0 bottom-0 w-full flex items-center h-16 px-5 border-t justify-between'>
                                <div className='flex items-center gap-2'>{tt('price')}: <span className='text-blue-600 font-black'>{supplierPrice.price}</span></div>
                                <button className='bg-blue-600 hover:bg-blue-500 text-white px-5 py-1 rounded-sm'>{t('header.book-now')}</button>
                            </div>
                        </div>
                    ))
                        : !bookingFormData.clientCardID ? <div className='py-20'>{t('booking.select-card')}</div> : bookingFormData.clientCardID && availableSupplier && !availableSupplier.length ? <div className='py-20'>{t('booking.no-supplier')}</div> : skeleton.map(item => (
                            <div className='border shadow w-full bg-white sm:w-80 h-44 flex flex-col gap-2 p-5' key={item}>
                                <h1 className='text-slate-700 border-b pb-2 w-44 h-8 bg-slate-200 animate-pulse rounded-md'></h1>
                                <div className='h-5 w-40 bg-slate-200 animate-pulse rounded-md'></div>
                                <div className='h-5 w-36 bg-slate-200 animate-pulse rounded-md'></div>
                                <div className='w-full flex justify-between mt-auto gap-4'>
                                    <div className='w-1/2 bg-slate-200 animate-pulse h-7 rounded-md'></div>
                                    <div className='px-5 h-7 bg-blue-200 animate-pulse rounded-md w-1/3'></div>
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