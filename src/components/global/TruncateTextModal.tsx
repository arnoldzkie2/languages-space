'use client'
import useGlobalStore from '@/lib/state/globalStore'
import React from 'react'
import { useTranslations } from 'use-intl'

const TruncateTextModal = () => {

    const { truncateText, closeTruncateTextModal } = useGlobalStore()
    const tt = useTranslations('global')

    if (!truncateText) return null

    return (
        <div className='fixed top-0 z-50 left-0 w-screen h-screen flex items-center justify-center padding bg-black bg-opacity-25'>
            <div className='p-10 text-slate-600 flex flex-col gap-5 bg-white shadow w-full sm:w-96 rounded-md'>
                {truncateText}
                <button onClick={closeTruncateTextModal} className='mt-3 py-1.5 rounded-md hover:bg-slate w-1/2 self-end border hover:bg-slate-100'>{tt('close')}</button>
            </div>
        </div>
    )
}

export default TruncateTextModal