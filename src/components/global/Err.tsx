'use client'
import useGlobalStore from '@/lib/state/globalStore'
import React from 'react'
import { Alert, AlertTitle } from '../ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const Err = () => {

    const err = useGlobalStore(s => s.err)

    if (!err) return null

    return (
        <div className='py-5'>
            <Alert variant="destructive">
                <AlertTitle className='flex items-center gap-4'>
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <div>{err}</div>
                </AlertTitle>
            </Alert>
        </div>
    )
}

export default Err