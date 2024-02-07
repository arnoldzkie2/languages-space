/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import Image from 'next/image';
import axios from 'axios'
import { signIn, signOut } from 'next-auth/react'
import { UploadButton } from '@/utils/uploadthing'
import { useEffect } from 'react'
import useClientStore from '@/lib/state/client/clientStore'
import useGlobalStore from '@/lib/state/globalStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import SubmitButton from '../global/SubmitButton';
import { toast } from 'sonner';

const ClientInfo = () => {

    const { setErr, isLoading } = useGlobalStore()
    const { client, setClient, updateClient, setPage } = useClientStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target

        if (client) {
            setClient({ ...client, [name]: value })
        } else {
            signOut()
        }
    }

    const t = useTranslations('client')
    const tt = useTranslations('global')

    const skeleton = (
        <div className='flex flex-col gap-1.5 w-full'>
            <Skeleton className='h-6 w-36 rounded-md'></Skeleton>
            <Skeleton className='w-full h-7 rounded-md'></Skeleton>
        </div>
    )

    useEffect(() => {
        setPage('profile')
    }, [])

    return (
        <form onSubmit={(e) => updateClient(e, signIn)} className='flex flex-col gap-5 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2 text-muted-foreground'>

            <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-foreground'>{t('profile.info')}</h1>
            {client ?
                <div className='flex items-center justify-around gap-5'>
                    <Image src={client.profile_url || '/profile/profile.svg'} alt='Profile' width={120} height={120} className='border min-w-[120px] min-h-[120px] object-cover bg-cover rounded-full' />
                    <div className='flex flex-col gap-3 items-start'>
                        <span className='block font-medium'>{tt('profile')}</span>
                        <UploadButton
                            endpoint="profileUploader"
                            onClientUploadComplete={async (res) => {
                                // Do something with the response
                                if (res) {

                                    const { data } = await axios.post('/api/uploadthing/profile/change/client', {
                                        profile: res[0], clientID: client.id
                                    })

                                    if (data.ok) {
                                        await signIn('credentials', {
                                            username: client.username, password: client.password, redirect: false
                                        })
                                        setClient({ ...client, profile_url: res[0].url })
                                        toast('Profile Changed')
                                    }
                                }
                            }}
                            onUploadError={(error: Error) => {
                                setErr('Something went wrong.')

                            }}
                            appearance={{
                                button: 'bg-primary text-secondary'
                            }}
                        />
                    </div>
                </div>

                :
                <div className='flex items-center justify-around'>
                    <Skeleton className='w-[120px] h-[120px] rounded-full'></Skeleton>
                    <div className='flex flex-col gap-3'>
                        <Skeleton className='w-32 h-7 rounded-md'></Skeleton>
                        <Skeleton className='w-40 h-9 rounded-md'></Skeleton>
                    </div>

                </div>
            }

            {client ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="name">{tt('name')}</Label>
                <Input className='text-foreground' placeholder={tt('name')} type="text" id='name' name='name' value={client.name || ''} onChange={handleChange} />
            </div> : skeleton}

            {client ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="email">{tt('email')}</Label>
                <Input className='text-foreground' placeholder={tt('email')} type="text" id='email' name='email' value={client.email || ''} onChange={handleChange} />
            </div> : skeleton}

            {client ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="phone_number">{tt('phone')}</Label>
                <Input className='text-foreground' placeholder={tt('phone')} type="number" id='phone_number' name='phone_number' value={client.phone_number || ''} onChange={handleChange} />
            </div> : skeleton}

            {client ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="address">{tt('address')}</Label>
                <Input className='text-foreground' placeholder={tt('address')} type="text" id='address' name='address' value={client.address || ''} onChange={handleChange} />
            </div> : skeleton}


            {client ? <div className="w-full items-center gap-1.5">
                <Label>{tt('gender')}</Label>
                <Select onValueChange={(gender) => setClient({ ...client, gender })} value={client.gender || ''}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={tt('select-gender')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{tt('gender')}</SelectLabel>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div> : skeleton}

            <SubmitButton msg={tt('update')} style='w-full mt-3' />
        </form>
    )
}

export default ClientInfo