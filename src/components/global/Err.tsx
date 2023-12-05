'use client'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import React from 'react'

const Err = () => {

    const { err } = useAdminGlobalStore()

    return (
        <>
            {err && <small className='text-red-600 px-6 bg-red-200 text-center py-1 rounded-md'>{err}</small>}
        </>
    )
}

export default Err