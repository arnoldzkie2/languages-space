'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import AgentEarningsHeader from '@/components/super-admin/management/agent/AgentEarningsHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRouter } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { cn } from '@/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {

    const [openAgent, setOpenAgent] = useState(false)
    const [formData, setFormData] = useState({
        agentID: '',
        name: '',
        quantity: 0,
        rate: 0,
    })
    const router = useRouter()
    const departmentID = useDepartmentStore(s => s.departmentID)
    const { isSideNavOpen, isLoading, setErr, setOkMsg, setIsLoading } = useGlobalStore()
    const { agents, getAgents } = useAdminAgentStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prevData => ({
            ...prevData, [name]: value
        }))
    }

    const createEarnings = async (e: FormEvent) => {

        e.preventDefault()

        const { agentID, name, quantity, rate } = formData
        if (!agentID) return setErr('Select Supplier')
        if (!name) return setErr('Earning Name')
        if (!quantity) return setErr('Quantity is required')
        if (!rate) return setErr('Rate is required')
        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/agent/balance/earnings', formData)
            if (data.ok) {
                setIsLoading(false)
                toast('Success! earnings created')
                setFormData({ agentID: '', name: '', quantity: 0, rate: 0 })
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    useEffect(() => {
        getAgents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])

    return (
        <div>
            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <AgentEarningsHeader />


                <div className='w-full px-8'>
                    <Card className='w-1/4'>
                        <CardHeader>
                            <CardTitle>{t("agent.earnings")}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='flex flex-col w-full gap-5' onSubmit={createEarnings}>

                                <Departments />

                                <div className='flex w-full flex-col gap-1.5'>
                                    <Label>{tt('agent')}</Label>
                                    <Popover open={openAgent} onOpenChange={setOpenAgent}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openAgent}
                                                className={cn(
                                                    "w-full justify-between",
                                                    !formData.agentID && "text-muted-foreground"
                                                )}
                                            >
                                                {formData.agentID
                                                    ? agents.find((agent) => agent.id === formData.agentID)?.username
                                                    : tt('select')}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder={t('agent.search')}
                                                    className="h-9"
                                                />
                                                <CommandEmpty>{t('agent.404')}</CommandEmpty>
                                                <CommandGroup>
                                                    {agents.length > 0 ? agents.map(agent => (
                                                        <CommandItem
                                                            key={agent.id}
                                                            className={`${formData.agentID === agent.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                            value={agent.username}
                                                            onSelect={() => {
                                                                setFormData(prev => ({ ...prev, agentID: agent.id }))
                                                                setOpenAgent(false)
                                                            }}
                                                        >
                                                            {agent.username}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    formData.agentID === agent.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    )) : <CommandItem>{t('agent.404')}</CommandItem>}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className='flex w-full flex-col gap-1'>
                                    <Label htmlFor="name">{tt('name')}</Label>
                                    <Input type="text"
                                        value={formData.name}
                                        name='name'
                                        onChange={handleChange}
                                        placeholder={tt('name')} />
                                </div>

                                <div className='flex w-full flex-col gap-1'>
                                    <Label htmlFor="rate">{tt('rate')}</Label>
                                    <Input type="text"
                                        value={formData.rate}
                                        name='rate'
                                        onChange={handleChange}
                                        placeholder={tt('rate')} />
                                </div>

                                <div className='flex w-full flex-col gap-1'>
                                    <Label htmlFor="quantity">{tt('quantity')}</Label>
                                    <Input type="text"
                                        value={formData.quantity}
                                        name='quantity'
                                        onChange={handleChange}
                                        placeholder={tt('quantity')} />
                                </div>

                                <div>Total: <strong>{formData.quantity * formData.rate}</strong></div>

                                <div className='flex w-full items-center gap-5'>
                                    <Button onClick={() => router.push('/admin/manage/agent')} className='w-full' variant={'ghost'} type='button'>{tt('cancel')}</Button>
                                    <SubmitButton msg={tt("confirm")} style='w-full' />
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default Page