'use client'
import useGlobalStore from '@/lib/state/globalStore'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface Props {
    msg: string
    style: string
}

const SubmitButton = ({ msg, style }: Props) => {

    const isLoading = useGlobalStore(state => state.isLoading)

    if (isLoading) return <Skeleton style={style} />

    return (
        <button className={`${style} hover:bg-opacity-80`}>{msg}</button>
    )
}

const Skeleton = ({ style }: { style: string }) => {
    return (
        <button className={`${style} bg-opacity-80`} disabled>
            <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} />
        </button>
    )
}

export default SubmitButton