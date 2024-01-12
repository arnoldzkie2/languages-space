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
import useGlobalStore from '@/lib/state/globalStore';
import useAgentStore from '@/lib/state/agent/agentStore';

const AgentInfo = () => {

    const { setIsLoading, setOkMsg, setErr, okMsg, err, isLoading, setPage } = useGlobalStore()
    const { agent, setAgent } = useAgentStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target

        if (agent) {
            setAgent({ ...agent, [name]: value })
        } else {
            signOut()
        }
    }

    const updateAgent = async (e: React.FormEvent) => {

        e.preventDefault()
        try {

            const { name, email, phone_number, gender, address, username, password, tags } = agent!

            setIsLoading(true)
            const { data } = await axios.patch('/api/agent', {
                name, email, phone_number, gender, address, tags
            })

            if (data.ok) {
                await signIn('credentials', {
                    username, password, redirect: false
                })
                setIsLoading(false)
                setOkMsg('Success')
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

    const t = useTranslations('client')
    const tt = useTranslations('global')

    const skeleton = (
        <div className='flex flex-col gap-1.5 w-full'>
            <div className='h-6 w-36 bg-slate-200 animate-pulse rounded-md'></div>
            <div className='w-full h-7 bg-slate-200 animate-pulse rounded-md'></div>
        </div>
    )

    const handleTagInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {
            event.preventDefault();

            const newTag = event.currentTarget.value.trim().toUpperCase();

            if (newTag && !agent?.tags?.includes(newTag)) {
                const updatedTags = [...agent?.tags!, newTag];
                setAgent({ ...agent!, tags: updatedTags })
                event.currentTarget.value = ''; // Clear the input
            } else {
                event.currentTarget.value = ''
            }
        }
    };

    const handleRemoveTag = (tag: string) => {
        const updatedTags = agent?.tags?.filter(item => item !== tag);
        const updatedFormData = { ...agent!, tags: updatedTags };
        setAgent(updatedFormData)
    }

    useEffect(() => {
        setPage('profile')
    }, [])

    return (
        <form onSubmit={updateAgent} className='flex flex-col gap-5 w-full lg:w-1/2 xl:w-1/4 order-1 md:order-2'>

            <h1 className='font-bold w-full text-2xl mb-2 pb-2 border-b text-blue-600'>{t('profile.info')}</h1>

            {err && <small className='text-red-600 w-1/2 bg-red-200 text-center py-1 rounded-md'>{err}</small>}
            {okMsg && <small className='text-green-600 w-1/2 bg-green-200 text-center py-1 rounded-md'>{okMsg}</small>}

            {agent ?
                <div className='flex items-center justify-around gap-5'>
                    <Image src={agent.profile_url || '/profile/profile.svg'} alt='Profile' width={120} height={120} className='border min-w-[120px] min-h-[120px] object-cover bg-cover rounded-full' />
                    <div className='flex flex-col gap-3 items-start'>
                        <span className='block font-medium'>{tt('profile')}</span>
                        <UploadButton
                            endpoint="profileUploader"
                            onClientUploadComplete={async (res) => {
                                // Do something with the response
                                if (res) {

                                    const { data } = await axios.post('/api/uploadthing/profile/change/agent', {
                                        profile: res[0], agentID: agent.id
                                    })

                                    if (data.ok) {
                                        await signIn('credentials', {
                                            username: agent.username, password: agent.password, redirect: false
                                        })
                                        setOkMsg('Profile Changed')
                                    }
                                }
                            }}
                            onUploadError={(error: Error) => {
                                setErr('Something went wrong.')

                            }}
                            appearance={{
                                button: 'hover:bg-blue-500'
                            }}
                        />
                    </div>
                </div>

                :
                <div className='flex items-center justify-around'>
                    <div className='w-[120px] h-[120px] rounded-full bg-slate-200 animate-pulse'></div>
                    <div className='flex flex-col gap-3'>
                        <div className='w-32 h-7 bg-slate-200 rounded-md animate-pulse'></div>
                        <div className='w-40 h-9 rounded-md animate-pulse bg-slate-200'></div>
                    </div>

                </div>
            }
            {agent ? <div className='flex flex-col w-full gap-1'>
                <label htmlFor="name" className='px-2 h-6 text-lg font-medium'>{tt('name')}</label>
                <input type="text" id='name' name='name' className='w-full border outline-none px-3 h-8' value={agent.name || ''} onChange={handleChange} />
            </div> : skeleton}

            {agent ? <div className='flex flex-col w-full gap-1'>
                <label htmlFor="email" className='px-2 h-6 text-lg font-medium'>{tt('email')}</label>
                <input type="text" id='email' name='email' className='w-full border outline-none px-3 h-8' value={agent.email || ''} onChange={handleChange} />
            </div> : skeleton}

            {agent ? <div className='flex flex-col w-full gap-1'>
                <label htmlFor="phone_number" className='px-2 h-6 text-lg font-medium'>{tt('phone')}</label>
                <input type="number" id='phone_number' name='phone_number' className='w-full border outline-none px-3 h-8' value={agent.phone_number || ''} onChange={handleChange} />
            </div> : skeleton}

            {agent ? <div className='flex flex-col w-full gap-1'>
                <label htmlFor="address" className='px-2 h-6 text-lg font-medium'>{tt('address')}</label>
                <input type="text" id='address' name='address' className='w-full border outline-none px-3 h-8' value={agent.address || ''} onChange={handleChange} />
            </div> : skeleton}
            {agent ? <div className='flex flex-col w-full gap-1'>
                <label htmlFor="gender" className='px-2 h-6 text-lg font-medium'>{tt('gender')}</label>
                <select name="gender" value={agent.gender || ''} onChange={handleChange} id="gender" className='px-3 h-8 border outline-none bg-white'>
                    <option value="">{tt('select-gender')}</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Prefer not to say</option>
                </select>
            </div>
                : skeleton}

            {agent ? <div className='w-full flex flex-col gap-2'>
                <label htmlFor="tags" className='font-medium' title='Enter to add tags'>{tt('tags')} (optional)</label>
                <input onKeyDown={handleTagInputChange} name='tags' type="text" className='w-full border outline-none py-1 px-3' id='tags' />
            </div> : skeleton}

            {agent ? <div className='flex flex-col gap-3'>
                <ul className='w-full flex items-center gap-5 flex-wrap'>
                    {agent?.tags?.length! > 0 && agent?.tags?.map(item => (
                        <li key={item} onClick={() => handleRemoveTag(item)} className='border cursor-pointer bg-slate-100 py-1 px-3 flex items-center gap-2'>
                            <div>{item}</div>
                            <FontAwesomeIcon icon={faXmark} />
                        </li>
                    ))}
                </ul>
            </div> : <ul className='flex items-center gap-5 flex-wrap w-full'>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-24'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-16'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-32'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-28'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-32'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-24'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-16'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-40'></li>
                <li className='bg-slate-200 animate-pulse rounded-sm h-8 w-20'></li>
            </ul>}

            <button disabled={isLoading} className={`w-1/4 mt-2 text-white py-2 rounded-md ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : tt('update')}</button>

        </form>
    )
}

export default AgentInfo