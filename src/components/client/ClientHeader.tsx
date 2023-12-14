/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Link } from '@/lib/navigation'
import useClientStore from '@/lib/state/client/clientStore'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ClientHeader = () => {

    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const { getClientCards, getClientBookings, getClientOrders, getAvailableCards, setClient, client } = useClientStore()

    const getAllUserData = async () => {
        try {
            await Promise.all([
                getClientCards(), getClientBookings(), getClientOrders(), getAvailableCards()
            ])
        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                alert(error.response.data.msg)
            }
        }
    }

    useEffect(() => {

        if (status === 'authenticated' && session?.user.type !== 'client') signOut()
        if (status === 'authenticated' && session.user.type === 'client' && !client) {
            setClient(session.user)
            getAllUserData()
        }
    }, [session])

    const [isOpen, setIsOpen] = useState(false)

    const skeleton = (
        <li className='bg-slate-200 animate-pulse h-5 w-28 rounded-3xl'></li>
    )

    const t = useTranslations('client')
    const tt = useTranslations('global')

    return (
        <header className={`z-10 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 h-16 md:h-20 fixed w-screen flex items-center top-0 left-0 justify-between text-gray-700 bg-white border-b`}>
            <Link href={'/client'} className='text-blue-600 font-black text-xl lg:text-2xl lg:w-96 tracking-tight'>LANGUAGES-SPACE</Link>
            <div className='absolute right-6 z-10 cursor-pointer lg:hidden sm:right-10 md:right-16' onClick={() => setIsOpen(prevState => !prevState)}>
                {isOpen ?
                    <div className='relative w-[20px] h-[16px]'>
                        <span className={`bg-gray-700 w-full h-0.5 top-1.5 absolute rotate-45 rounded-md`}></span>
                        <span className={`bg-gray-700 w-full h-0.5 top-1.5 absolute -rotate-45 rounded-md`}></span>
                    </div>
                    :
                    <div className='relative w-[20px] h-[16px]'>
                        <span className={`bg-gray-700 top-0 w-full h-0.5 absolute rounded-md`}></span>
                        <span className={`bg-gray-700 top-[6.5px] w-full h-0.5 absolute rounded-md`}></span>
                        <span className={`bg-gray-700 bottom-0 w-full h-0.5 absolute rounded-md`}></span>
                    </div>
                }
            </div>
            <ul className={`w-full lg:flex lg:items-center lg:gap-5 ${isOpen ? 'gap-3 shadow-2xl flex flex-col fixed top-0 left-0 w-screen bg-white px-5 sm:px-10 md:px-16 md:pt-[8.7px] pb-5 pt-[8.2px] text-gray-600' : 'hidden'}`}>
                <Link href={'/client'} className='lg:hidden text-blue-600 font-black text-xl mt-3 tracking-tight'>LANGUAGES-SPACE</Link>
                <div className='lg:ml-auto flex flex-col gap-3 lg:gap-5 lg:flex-row'>
                    <Link className='active:text-blue-600 w-24 lg:hover:text-blue-600 lg:text-center' href={'/client/buy'}>{t('header.buy-card')}</Link>
                    <Link className='active:text-blue-600 w-24 lg:hover:text-blue-600 lg:text-center' href={'/client/booking'}>{t('header.book-now')}</Link>
                </div>
                <div className={`mt-2 lg:mt-0 flex items-center gap-5 lg:ml-auto`}>
                    <Link href={'/client/profile'} className='flex items-center gap-2 px-3 py-1 border hover:bg-slate-100 rounded-md'>
                        {session?.user.id ? <Image src={session.user?.profile_url || '/profile/profile.svg'} alt='Profile' width={25} height={25} className='rounded-full min-w-[25px] min-h-[25px] object-cover border max-h-7 max-w-7' />
                            : <div className='w-[30px] h-[30px] rounded-full border bg-slate-200 animate-pulse'></div>}
                        {session?.user.id ? <h1 className='w-28'>{session?.user.username}</h1> : skeleton}
                    </Link>
                    <button onClick={() => signOut({
                        redirect: true,
                        callbackUrl: '/login'
                    })} className='active:text-blue-600 lg:hover:text-blue-600 flex items-center justify-center gap-2'>
                        <FontAwesomeIcon icon={faArrowRightToBracket} width={16} height={16} />{tt('logout')}</button>
                </div>
            </ul>
        </header>
    )
}

export default ClientHeader
