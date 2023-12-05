/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import useClientStore from '@/lib/state/client/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AvailableCards = () => {

    const router = useRouter()

    const [searchQuery, setSearchQery] = useState('')
    const [maxVisibleItems, setMaxVisibleItems] = useState(6);

    const { isLoading, setIsLoading } = useAdminGlobalStore()
    const { availableCards, getAvailableCards } = useClientStore()

    const skeleton = [1, 2, 3, 4, 5, 6]

    const filterCards = availableCards && availableCards.filter(card => card.name.toUpperCase().includes(searchQuery.toUpperCase())).slice(0, maxVisibleItems)

    const checkoutCard = async (e: React.FormEvent<HTMLButtonElement>, cardID: string) => {

        e.preventDefault()

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/stripe/checkout', {
                cardID, quantity: 1
            })

            if (data.ok) {
                setIsLoading(false)
                router.push(data.data)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            if (error.response.data.msg) {
                alert(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const t = useTranslations('client')
    const ttt = useTranslations('super-admin')
    const tt = useTranslations('global')

    useEffect(() => {

        if (!availableCards) getAvailableCards()

    }, [])

    return (
        <div className='padding py-28 flex flex-col items-center text-slate-600'>
            <div className='w-full flex flex-col gap-5 sm:bg-white sm:p-5 sm:shadow 2xl:w-1/2'>
                <div className='w-full relative'>
                    <FontAwesomeIcon icon={faSearch} width={16} height={16} className='absolute right-3 top-3 text-slate-600' />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQery(e.target.value)} placeholder={ttt('client-card.search')} className='py-1.5 px-3 border w-full outline-none' />
                </div>
                <div className='w-full flex gap-8 items-center justify-evenly flex-wrap'>
                    {filterCards && filterCards.length > 0 ? filterCards.map(card => (
                        <div className='shadow w-full sm:w-80 h-56 border bg-white flex flex-col gap-1.5 p-5' key={card.id}>
                            <h1 className='text-slate-700 border-b pb-2 h-8 text-xl font-black uppercase'>{card.name}</h1>
                            <small className='h-5'>{t('card.validity')}: {card.validity} {t('card.days')}</small>
                            <small className='h-5'>{t('card.balance')}: <span className='font-bold'>{card.balance}</span></small>
                            <div className='h-5 flex gap-3 w-full items-center text-xs'>
                                <label htmlFor="courses" className='w-24'>
                                    {tt('courses')}:
                                </label>
                                <select id='courses' className='w-full px-2 h-5 outline-none rounded-sm cursor-pointer'>
                                    {card.supported_courses.map(course => (
                                        <option key={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='h-5 flex gap-3 w-full items-center text-xs'>
                                <label htmlFor="suppliers" className='w-24'>
                                    {tt('suppliers')}:
                                </label>
                                <select id='suppliers' className='w-full px-2 h-5 outline-none rounded-sm cursor-pointer'>
                                    {card.supported_suppliers.map(sup => (
                                        <option key={sup.supplier.id}>{sup.supplier.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-full flex justify-between mt-3'>
                                <div className='flex items-center gap-2 text-sm'>{t('card.price')}: <span className='text-blue-600 font-bold'>¥{card.price}</span></div>
                                <button disabled={isLoading} className={`text-sm w-1/3 ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} h-7 text-white rounded-md`} onClick={(e) => checkoutCard(e, card.id)}>{isLoading ?
                                    <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' />
                                    : t('card.buy')}</button>
                            </div>
                        </div>
                    ))
                        : skeleton.map(item => (
                            <div className='border shadow w-full bg-white sm:w-80 h-56 flex flex-col gap-2 p-5' key={item}>
                                <h1 className='text-slate-700 border-b pb-2 w-44 h-8 bg-slate-200 animate-pulse rounded-md'></h1>
                                <div className='h-5 w-40 bg-slate-200 animate-pulse rounded-md'></div>
                                <div className='h-5 w-24 bg-slate-200 animate-pulse rounded-md'></div>
                                <ul className='w-full flex gap-3 h-5'>
                                    <li className='h-5 w-24 bg-slate-200 animate-pulse rounded-md'></li>
                                    <li className='h-5 w-full bg-slate-200 animate-pulse rounded-md'></li>
                                </ul>
                                <ul className='w-full flex gap-3 h-5'>
                                    <li className='h-5 w-24 bg-slate-200 animate-pulse rounded-md'></li>
                                    <li className='h-5 w-full bg-slate-200 animate-pulse rounded-md'></li>
                                </ul>
                                <div className='w-full flex justify-between mt-auto gap-4'>
                                    <div className='w-1/2 bg-slate-200 animate-pulse h-7 rounded-md'></div>
                                    <div className='px-5 h-7 bg-blue-200 animate-pulse rounded-md w-1/3'></div>
                                </div>
                            </div>
                        ))}
                </div>
                {availableCards && availableCards.length > maxVisibleItems && (
                    <button
                        onClick={() => setMaxVisibleItems((prevState) => prevState + 6)}
                        className='text-blue-600 hover:text-blue-500 cursor-pointer mt-5'
                    >
                        {tt('show-more')}
                    </button>
                )}

            </div>
        </div>
    )
}

export default AvailableCards