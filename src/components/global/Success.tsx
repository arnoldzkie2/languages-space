'use client'
import useGlobalStore from '@/lib/state/globalStore'
import React from 'react'

const Success = () => {

    const okMsg = useGlobalStore(s => s.okMsg)

    return (
        <>
            {okMsg && <small className='text-green-600 px-6 bg-green-200 text-center py-1 rounded-md'>{okMsg}</small>}
        </>
    )
}

export default Success