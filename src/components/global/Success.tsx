'use client'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import React from 'react'

const Success = () => {

    const { okMsg } = useAdminGlobalStore()

    return (
        <>
            {okMsg && <small className='text-green-600 px-6 bg-green-200 text-center py-1 rounded-md'>{okMsg}</small>}
        </>
    )
}

export default Success