/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Link } from '@/lib/navigation'
import useAgentStore from '@/lib/state/agent/agentStore'
import { faArrowRightToBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import ThemeToggle from '../global/DarkmodeToggle'

const AgentHeader = () => {

    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })
    const { setAgent, getAgentDepartment, agentDepartment } = useAgentStore()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (status === 'authenticated' && session?.user.type !== 'agent') signOut()
        if (status === 'authenticated' && session.user.type === 'agent') {
            setAgent(session.user)
            if (!agentDepartment) getAgentDepartment()
        }
    }, [session])

    const skeleton = (
        <Skeleton className='h-5 w-28 rounded-3xl'></Skeleton>
    )

    const tt = useTranslations('global')
    const t = useTranslations("agent")

    return (
        <header className={`z-10 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 h-16 md:h-20 fixed w-screen flex items-center top-0 left-0 justify-between text-muted-foreground backdrop-blur border-b`}>
            <Link href={'/agent/invite'} className='text-primary font-black text-xl lg:text-2xl lg:w-96 tracking-tight'>LANGUAGES-SPACE</Link>
            <div className='absolute right-6 z-10 cursor-pointer lg:hidden sm:right-10 md:right-16' onClick={() => setIsOpen(prevState => !prevState)}>
                <FontAwesomeIcon icon={isOpen ? faXmark : faBars} width={16} height={16} className='text-lg' />
            </div>
            <ul className={`w-full lg:flex lg:items-center lg:gap-5 ${isOpen ? 'gap-3 shadow-2xl flex flex-col fixed top-0 left-0 w-screen bg-white px-5 sm:px-10 md:px-16 md:pt-[8.7px] pb-5 pt-[8.2px] text-gray-600' : 'hidden'}`}>
                <Link href={'/client'} className='lg:hidden text-primary font-black text-xl mt-3 tracking-tight'>LANGUAGES-SPACE</Link>
                <div className='lg:ml-auto flex flex-col gap-3 lg:gap-4 lg:items-center lg:flex-row'>
                    <Link className='active:text-primary w-28 lg:hover:text-primary lg:text-center' href={'/agent/invite'}>{t("header.invite")}</Link>
                </div>
                <div className={`mt-2 lg:mt-0 flex items-center gap-5 lg:ml-auto`}>
                    <Link href={'/agent/profile'} className='flex items-center gap-2 px-3 py-1 border hover:text-foreground hover:bg-muted rounded-md'>
                        {session?.user.id ? <Image src={session.user?.profile_url || '/profile/profile.svg'} alt='Profile' width={25} height={25} className='rounded-full min-w-[25px] min-h-[25px] object-cover border max-h-7 max-w-7' />
                            : <div className='w-[30px] h-[30px] rounded-full border bg-slate-200 animate-pulse'></div>}
                        {session?.user.id ? <h1 className='w-28'>{session?.user.username}</h1> : skeleton}
                    </Link>
                    <ThemeToggle />
                    <button onClick={() => signOut({
                        redirect: true,
                        callbackUrl: '/auth'
                    })} className='active:text-primary lg:hover:text-primary flex items-center justify-center gap-2'>
                        <FontAwesomeIcon icon={faArrowRightToBracket} width={16} height={16} />{tt('logout')}</button>
                </div>
            </ul>
        </header>
    )
}

export default AgentHeader
