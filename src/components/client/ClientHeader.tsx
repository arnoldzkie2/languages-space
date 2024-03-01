/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Link } from '@/lib/navigation'
import useClientStore from '@/lib/state/client/clientStore'
import { faArrowRightToBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import TruncateTextModal from '../global/TruncateTextModal'
import { CLIENT } from '@/utils/constants'
import { Skeleton } from '../ui/skeleton'
import ThemeToggle from '../global/DarkmodeToggle'

const ClientHeader = () => {

    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const client = useClientStore(state => state.client)
    const setClient = useClientStore(state => state.setClient)

    useEffect(() => {

        if (status === 'authenticated' && session?.user.type !== 'client') signOut()
        if (status === 'authenticated' && session.user.type === CLIENT && !client) {
            setClient(session.user)
        }
    }, [session])

    const [isOpen, setIsOpen] = useState(false)

    const skeleton = (
        <Skeleton className='h-5 w-28 rounded-3xl'></Skeleton>
    )

    const t = useTranslations()

    return (
        <header className={`z-10 padding backdrop-blur-lg h-16 fixed w-screen flex items-center top-0 left-0 justify-between text-muted-foreground border-b`}>
            <Link href={'/client'} className='text-primary font-black text-xl lg:text-2xl lg:w-96 tracking-tight'>LANGUAGES-SPACE</Link>
            <div className='absolute right-6 z-10 cursor-pointer lg:hidden sm:right-10 md:right-16' onClick={() => setIsOpen(prevState => !prevState)}>
                <FontAwesomeIcon icon={isOpen ? faXmark : faBars} width={20} height={20} className='text-lg' />
            </div>
            <ul className={`w-full lg:flex lg:items-center lg:gap-5 ${isOpen ? 'gap-3 shadow-2xl flex flex-col fixed top-0 left-0 w-screen bg-background border-b px-5 sm:px-10 md:px-16 md:pt-[8.7px] pb-5 pt-[8.2px] text-muted-foreground' : 'hidden'}`}>
                <Link href={'/client'} className='lg:hidden text-primary font-black text-xl mt-3 tracking-tight'>LANGUAGES-SPACE</Link>
                <div className='lg:ml-auto flex flex-col gap-3 lg:gap-5 lg:flex-row'>
                    <Link className='active:text-primary w-24 lg:hover:text-primary lg:text-center' href={'/client/buy'}>{t('client.page.header.buy_card')}</Link>
                    <Link className='active:text-primary w-24 lg:hover:text-primary lg:text-center' href={'/client/booking'}>{t('client.page.header.book_now')}</Link>
                </div>
                <div className={`mt-2 lg:mt-0 flex items-center gap-5 lg:ml-auto`}>
                    <Link href={'/client/profile'} className='flex items-center gap-2 px-3 py-1 border hover:bg-muted hover:text-foreground rounded-md'>
                        {session?.user.id ? <Image src={session.user?.profile_url || '/profile/profile.svg'} alt='Profile' width={30} height={30} className='rounded-full min-w-[30px] min-h-[30px] object-cover border max-h-7 max-w-7' />
                            : <Skeleton className='w-[30px] h-[30px] rounded-full border'></Skeleton>}
                        {session?.user.id ? <h1 className='w-28'>{session?.user.username}</h1> : skeleton}
                    </Link>
                    <ThemeToggle />
                    <button onClick={() => signOut({
                        redirect: true,
                        callbackUrl: '/auth'
                    })} className='active:text-primary lg:hover:text-primary flex items-center justify-center gap-2'>
                        <FontAwesomeIcon icon={faArrowRightToBracket} width={16} height={16} />
                        {t('auth.logout')}</button>
                </div>
            </ul>
            <TruncateTextModal />
        </header>
    )
}

export default ClientHeader
