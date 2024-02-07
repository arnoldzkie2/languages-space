'use client'
import useGlobalStore from '@/lib/state/globalStore'
import React from 'react'
import { useTranslations } from 'use-intl'
import { Button } from '../ui/button'

const TruncateTextModal = () => {

    const { truncateText, closeTruncateTextModal, copy } = useGlobalStore()
    const tt = useTranslations('global')

    if (!truncateText) return null

    return (
        <div className='fixed top-0 z-50 left-0 w-screen h-screen flex items-center justify-center padding backdrop-blur-[2px]' onClick={closeTruncateTextModal}>
            <div className='p-10 flex flex-col gap-5 bg-card shadow border w-full sm:w-96 rounded-md text-foreground'>
                {truncateText}
                <Button onClick={() => {
                    copy(truncateText)
                }}>{tt('copy')}</Button>
            </div>
        </div>
    )
}

export default TruncateTextModal