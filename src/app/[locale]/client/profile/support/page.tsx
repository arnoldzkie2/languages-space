/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { FormEvent, useEffect, useState } from 'react'
import useClientStore from '@/lib/state/client/clientStore'
import ClientProfile from '@/components/client/ClientProfile'
import ClientHeader from '@/components/client/ClientHeader'
import useGlobalStore from '@/lib/state/globalStore'
import Err from '@/components/global/Err'
import Success from '@/components/global/Success'
import { Button } from '@/components/ui/button'

const Page = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        phone: ''
    })

    const { setPage } = useClientStore()
    const t = useTranslations('client')
    const tt = useTranslations('global')

    const { setErr, isLoading, setIsLoading, setOkMsg } = useGlobalStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const contactSupport = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { name, email, message, phone } = formData
        if (!name || !email || !phone || !message) return setErr("Fill up inputs")
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/email/support', {
                email, message, name, phone
            })

            if (data.ok) {
                setFormData({
                    name: '', email: '', phone: '', message: ''
                })
                setIsLoading(false)
                setOkMsg("Success")
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }
    useEffect(() => {
        setPage('support')
    }, [])

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />

                <form onSubmit={(e) => contactSupport(e)} className='flex flex-col gap-3 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2 bg-white p-10 shadow-xl rounded-2xl'>

                    <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-blue-600'>{t('profile.support')}</h1>
                    <Err />
                    <Success />
                    <div className='flex w-full items-center gap-5'>
                        <input
                            required
                            type='name'
                            value={formData.name}
                            className='w-full px-3 py-1.5 rounded-md outline-none border'
                            placeholder={tt('name')}
                            name='name'
                            onChange={handleChange} />

                        <input
                            required
                            type='email'
                            value={formData.email}
                            className='w-full px-3 py-1.5 rounded-md outline-none border'
                            placeholder={tt('email')}
                            name='email'
                            onChange={handleChange} />
                    </div>

                    <input
                        required
                        type='number'
                        value={formData.phone}
                        className='w-full px-3 py-1.5 rounded-md outline-none border'
                        placeholder={tt('phone')}
                        name='phone'
                        onChange={handleChange} />

                    <textarea
                        required
                        value={formData.message}
                        onChange={handleChange}
                        name='message'
                        className='resize-none h-full border outline-none rounded-md p-3'
                        placeholder={tt("message")} />
                    <Button disabled={isLoading} className={`w-full px-6  text-white py-2 rounded-md ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('submit')}</Button>
                </form>
            </div>
        </>

    )
}

export default Page