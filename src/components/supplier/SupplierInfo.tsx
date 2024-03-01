/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import Image from 'next/image';
import axios from 'axios'
import { signIn, signOut } from 'next-auth/react'
import { UploadButton } from '@/utils/uploadthing'
import { useEffect } from 'react'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import useGlobalStore from '@/lib/state/globalStore';
import { Skeleton } from '../ui/skeleton';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import SubmitButton from '../global/SubmitButton';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

const SupplierInfo = () => {

    const { setIsLoading, setOkMsg, setErr, okMsg, err, isLoading } = useGlobalStore()
    const { supplier, setSupplier } = useSupplierStore()
    const setPage = useSupplierStore(state => state.setPage)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target

        if (supplier) {
            setSupplier({ ...supplier, [name]: value })
        } else {
            signOut()
        }
    }

    const updateSupplier = async (e: React.FormEvent) => {

        e.preventDefault()
        try {

            const { name, email, phone_number, gender, address, username, password, tags } = supplier!

            setIsLoading(true)
            const { data } = await axios.patch('/api/supplier', {
                name, email, phone_number, gender, address, tags
            },
                { params: { supplierID: supplier?.id } }
            )

            if (data.ok) {
                toast("Success! info updated.")
                await signIn('credentials', {
                    username, password, redirect: false
                })
                setIsLoading(false)
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

    const t = useTranslations()

    const skeleton = (
        <div className='flex flex-col gap-1.5 w-full'>
            <Skeleton className='h-6 w-36  rounded-md'></Skeleton>
            <Skeleton className='w-full h-7  rounded-md'></Skeleton>
        </div>
    )

    const handleTagInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {
            event.preventDefault();

            const newTag = event.currentTarget.value.trim().toUpperCase();

            if (newTag && !supplier?.tags?.includes(newTag)) {
                const updatedTags = [...supplier?.tags!, newTag];
                setSupplier({ ...supplier!, tags: updatedTags })
                event.currentTarget.value = ''; // Clear the Input
            } else {
                event.currentTarget.value = ''
            }
        }
    };

    const handleRemoveTag = (tag: string) => {
        const updatedTags = supplier?.tags?.filter(item => item !== tag);
        const updatedFormData = { ...supplier!, tags: updatedTags };
        setSupplier(updatedFormData)
    }

    useEffect(() => {
        setPage('profile')
    }, [])

    return (
        <form onSubmit={updateSupplier} className='flex flex-col gap-4 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2 text-muted-foreground'>
            <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-foreground'>{t('profile.info')}</h1>
            {supplier ?
                <div className='flex items-center justify-around gap-5'>
                    <Image src={supplier.profile_url || '/profile/profile.svg'} alt='Profile' width={120} height={120} className='border min-w-[120px] min-h-[120px] object-cover bg-cover rounded-full' />
                    <div className='flex flex-col gap-3 items-start'>
                        <span className='block font-medium'>{t('profile.image')}</span>
                        <UploadButton
                            endpoint="profileUploader"
                            onClientUploadComplete={async (res) => {
                                // Do something with the response
                                if (res) {

                                    setSupplier({ ...supplier, profile_url: res[0].url })
                                    const { data } = await axios.post('/api/uploadthing/profile/change/supplier', {
                                        profile: res[0], supplierID: supplier.id
                                    })

                                    if (data.ok) {
                                        toast('Profile Changed')
                                        await signIn('credentials', {
                                            username: supplier.username, password: supplier.password, redirect: false
                                        })
                                    }
                                }
                            }}
                            onUploadError={(error: Error) => {
                                setErr('Something went wrong.')
                            }}
                            appearance={{
                                button: 'bg-primary'
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
            {supplier ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="name">{t('info.name')}</Label>
                <Input type="text" id='name' name='name' value={supplier.name || ''} onChange={handleChange} />
            </div> : skeleton}

            {supplier ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="email">{t('info.email.h1')}</Label>
                <Input type="text" id='email' name='email' value={supplier.email || ''} onChange={handleChange} />
            </div> : skeleton}

            {supplier ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="phone_number">{t('info.phone')}</Label>
                <Input type="number" id='phone_number' name='phone_number' value={supplier.phone_number || ''} onChange={handleChange} />
            </div> : skeleton}

            {supplier ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="address">{t('info.address')}</Label>
                <Input type="text" id='address' name='address' value={supplier.address || ''} onChange={handleChange} />
            </div> : skeleton}
            {supplier ?
                <div className="w-full items-center gap-1.5">
                    <Label>{t('info.gender.h1')}</Label>
                    <Select onValueChange={(gender) => setSupplier({ ...supplier, gender })} value={supplier.gender || ''}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('info.gender.select')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('info.gender.h1')}</SelectLabel>
                                <SelectItem value="male">{t('info.gender.male')}</SelectItem>
                                <SelectItem value="female">{t('info.gender.female')}</SelectItem>
                                <SelectItem value="others">{t('info.gender.others')}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                : skeleton}

            {supplier ? <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="tags" className='font-medium' title='Enter to add tags'>{t('info.tags')} {t("global.optional")}</Label>
                <Input onKeyDown={handleTagInputChange} name='tags' type="text" className='w-full border outline-none py-1 px-3' id='tags' />
            </div> : skeleton}

            {supplier ? <div className='flex flex-col gap-3'>
                <ul className='w-full flex items-center gap-3 flex-wrap'>
                    {supplier?.tags?.length! > 0 && supplier?.tags?.map(item => (
                        <li key={item} onClick={() => handleRemoveTag(item)} className='border cursor-pointer bg-secondary py-1 px-3 flex items-center gap-2'>
                            <div>{item}</div>
                            <FontAwesomeIcon icon={faXmark} />
                        </li>
                    ))}
                </ul>
            </div> : <ul className='flex items-center gap-5 flex-wrap w-full'>
                <Skeleton className='rounded-sm h-8 w-24'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-16'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-32'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-28'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-32'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-24'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-16'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-40'></Skeleton>
                <Skeleton className='rounded-sm h-8 w-20'></Skeleton>
            </ul>}

            <SubmitButton msg={t('operation.update')} />
        </form>
    )
}

export default SupplierInfo