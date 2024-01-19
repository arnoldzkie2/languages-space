/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
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

const Page = () => {

    const router = useRouter()
    const pathname = usePathname()
    const { client, setClient, setPage } = useClientStore()
    const t = useTranslations('client')
    const tt = useTranslations('global')

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
                setIsLoading(false)
                await signIn('credentials', { username, password, redirect: false })
                setOkMsg('Success')
                setTimeout(() => {
                    setOkMsg('')
                }, 3000)
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
            <div className='h-6 w-36 bg-slate-200 animate-pulse rounded-md'></div>
            <div className='w-full h-7 bg-slate-200 animate-pulse rounded-md'></div>
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

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />

                <form onSubmit={(e) => updateClient(e)} className='flex flex-col gap-6 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2'>

                    <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-blue-600'>{t('profile.account-info')}</h1>
                    <Err />
                    <Success />
                    <div className='w-full flex flex-col gap-2'>
                        <label htmlFor="locale" className='px-2 h-6 text-lg font-medium'>{tt('select-language')}</label>
                        <select id='locale' className={`py-2 w-full px-1 text-sm border cursor-pointer border-b focus:outline-none focus:ring-0 outline-none`} value={locale} onChange={handleTranslation}>
                            {locales.map(loc => (
                                <option value={loc.loc} key={loc.loc} className='flex items-center justify-between'>
                                    {loc.val}
                                </option>
                            ))}
                        </select>
                    </div>

                    {client?.id ? <div className='flex flex-col w-full gap-1'>
                        <label htmlFor="username" className='px-2 h-6 text-lg font-medium'>{tt('username')}</label>
                        <input type="text" id='name' name='username' className='w-full border outline-none px-3 h-8' value={client.username} onChange={handleChange} />
                    </div> : skeleton}

                    {client?.id ? <div className='flex flex-col w-full gap-1 relative'>
                        <label htmlFor="password" className='px-2 h-6 text-lg font-medium'>{tt('password')}</label>
                        <input type={eye ? 'text' : 'password'} id='password' name='password' className='w-full border outline-none px-3 pr-8 h-8' value={client.password} onChange={handleChange} />
                        <FontAwesomeIcon icon={eye ? faEyeSlash : faEye} width={16} height={16} className='absolute right-3 bottom-2 cursor-pointer hover:text-black' onClick={toggleEye} />
                    </div> : skeleton}

                    <button disabled={isLoading} className={`self-start px-6 mt-2 text-white py-2 rounded-md ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('update')}</button>
                </form>
            </div>
        </>

    )
}

export default Page