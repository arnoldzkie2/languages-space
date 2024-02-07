/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { FormEvent, useEffect, useState } from 'react'
import useClientStore from '@/lib/state/client/clientStore'
import ClientProfile from '@/components/client/ClientProfile'
import ClientHeader from '@/components/client/ClientHeader'
import useGlobalStore from '@/lib/state/globalStore'
import Err from '@/components/global/Err'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import SubmitButton from '@/components/global/SubmitButton'
import { toast } from 'sonner'

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

    const { setErr, setIsLoading } = useGlobalStore()

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
                toast("Success! we received your message.")
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
            <div className='px-5 md:flex-row lg:justify-center text-muted-foreground sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />

                <Card className='order-1 md:order-2 self-center w-full sm:w-96 md:w-[420px]'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>{t('profile.support')}</CardTitle>
                        <CardDescription><Err /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => contactSupport(e)} className='flex flex-col gap-3 w-full'>
                            <div className='flex w-full items-center gap-5'>
                                <Input
                                    required
                                    type='name'
                                    value={formData.name}
                                    placeholder={tt('name')}
                                    name='name'
                                    onChange={handleChange} />

                                <Input
                                    required
                                    type='email'
                                    value={formData.email}
                                    placeholder={tt('email')}
                                    name='email'
                                    onChange={handleChange} />
                            </div>

                            <Input
                                required
                                type='number'
                                value={formData.phone}
                                placeholder={tt('phone')}
                                name='phone'
                                onChange={handleChange} />

                            <Textarea
                                required
                                value={formData.message}
                                onChange={handleChange}
                                name='message'
                                className='h-[250px] resize-none'
                                placeholder={tt("message")} />
                            <SubmitButton msg={tt('submit')} />

                        </form>
                    </CardContent>
                </Card>

            </div>
        </>

    )
}

export default Page