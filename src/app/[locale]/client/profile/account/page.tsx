/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { FormEvent, useEffect } from 'react'
import useClientStore from '@/lib/state/client/clientStore'
import { usePathname, useRouter } from '@/lib/navigation'
import ClientProfile from '@/components/client/ClientProfile'
import ClientHeader from '@/components/client/ClientHeader'
import useGlobalStore from '@/lib/state/globalStore'
import Err from '@/components/global/Err'
import Success from '@/components/global/Success'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import SubmitButton from '@/components/global/SubmitButton'
import { toast } from 'sonner'

const Page = () => {

    const router = useRouter()
    const pathname = usePathname()
    const { client, setClient, setPage } = useClientStore()

    const { setErr, isLoading, setIsLoading, setOkMsg, eye, toggleEye, locales } = useGlobalStore()

    const updateClient = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const { username, password, id } = client!
            if (!username) return setErr('Username is required')
            if (username.length < 6) return setErr('Username is to short minimum 6 characters.')
            if (!password) return setErr('Password is required')

            setIsLoading(true)
            const { data } = await axios.patch('/api/client', { username, password }, { params: { clientID: id } })

            if (data.ok) {
                toast('Success! account updated.')
                setIsLoading(false)
                await signIn('credentials', { username, password, redirect: false })
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                setTimeout(() => {
                    setErr('')
                }, 5000)
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setClient({ ...client!, [name]: value })
    }

    const skeleton = (
        <div className='flex flex-col gap-1.5 w-full'>
            <Skeleton className='h-6 w-36 rounded-md'></Skeleton>
            <Skeleton className='w-full h-7 rounded-md'></Skeleton>
        </div>
    )

    const handleTranslation = (event: React.ChangeEvent<HTMLSelectElement>) => {
        router.replace(pathname, { locale: event.target.value })
        setOkMsg('Please wait')
        setTimeout(() => {
            setOkMsg('Success')
            window.location.reload()
        }, 1200)
    }

    const locale = useLocale()

    useEffect(() => {
        setPage('account')
    }, [])

    const t = useTranslations()

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-muted-foreground sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <Card className='order-1 md:order-2 w-full lg:w-/2 xl:w-1/4'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>{t('profile.account')}</CardTitle>
                        <CardDescription><Err /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => updateClient(e)} className='flex flex-col gap-6 w-full text-muted-foreground'>
                            <Success />
                            <div className='w-full flex flex-col gap-2'>
                                <Label htmlFor="locale">{t('global.select_language')}</Label>
                                <select id='locale' className={`py-2 w-full px-1 text-sm border bg-card cursor-pointer border-b focus:outline-none focus:ring-0 outline-none`} value={locale} onChange={handleTranslation}>
                                    {locales.map(loc => (
                                        <option value={loc.loc} key={loc.loc} className='flex items-center justify-between'>
                                            {loc.val}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {client?.id ? <div className='flex flex-col w-full gap-1'>
                                <Label htmlFor="username">{t('info.username')}</Label>
                                <Input type="text" id='name' name='username' value={client.username} onChange={handleChange} />
                            </div> : skeleton}

                            {client?.id ? <div className='flex flex-col w-full gap-1 relative'>
                                <Label htmlFor="password">{t('info.password')}</Label>
                                <Input type={eye ? 'text' : 'password'} id='password' name='password' value={client.password} onChange={handleChange} />
                                <FontAwesomeIcon icon={eye ? faEyeSlash : faEye} width={16} height={16} className='absolute right-3 bottom-2 cursor-pointer hover:text-foreground' onClick={toggleEye} />
                            </div> : skeleton}

                            <SubmitButton msg={t('operation.update')} />
                        </form>
                    </CardContent>
                </Card>

            </div>
        </>

    )
}

export default Page