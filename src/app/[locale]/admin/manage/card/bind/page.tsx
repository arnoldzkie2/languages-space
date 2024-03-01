/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import BindCardHeader from '@/components/super-admin/management/card/BindCardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRouter } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { cn } from '@/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {

    const [selectedClientID, setSelectedClientID] = useState('')
    const [openClient, setOpenClient] = useState(false)
    const [selectedCardID, setSelectedCardID] = useState('')
    const [openCard, setOpenCard] = useState(false)
    const { clients, getClients } = useAdminClientStore()
    const { isSideNavOpen, setIsLoading, setErr } = useGlobalStore()
    const { cards, getCards } = useAdminCardStore()
    const { departmentID } = useDepartmentStore()
    const router = useRouter()

    useEffect(() => {
        setSelectedClientID('')
        setSelectedCardID('')
        getClients()
        getCards()
    }, [departmentID])

    const bindCardToUser = async (e: React.FormEvent) => {

        e.preventDefault()
        if (!selectedClientID) return setErr('Select a Client to bind')
        if (!selectedCardID) return setErr('Select a Card to bind')
        try {

            setIsLoading(true)

            const { data } = await axios.post('/api/client//card/bind', {
                clientID: selectedClientID,
                cardID: selectedCardID
            })

            if (data.ok) {
                setIsLoading(false)
                toast("The card has been successfully bind to the client.")
                setSelectedClientID('')
                setSelectedCardID('')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            setErr('Something went wrong')
        }
    }

    const t = useTranslations()

    return (
        <div>
            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <BindCardHeader />

                <div className='w-full px-8'>

                    <Card className='w-1/4'>
                        <CardHeader>
                            <CardTitle>{t('card.bind')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className='flex flex-col w-full gap-5' onSubmit={bindCardToUser}>
                                <Departments />
                                <div className='flex w-full flex-col gap-1.5'>
                                    <Label>{t('side_nav.client')}</Label>
                                    <Popover open={openClient} onOpenChange={setOpenClient}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openClient}
                                                className={cn(
                                                    "w-full justify-between",
                                                    !selectedClientID && "text-muted-foreground"
                                                )}
                                            >
                                                {selectedClientID
                                                    ? clients.find((client) => client.id === selectedClientID)?.username
                                                    : t('client.select.h1')}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder={t('client.search')}
                                                    className="h-9"
                                                />
                                                <CommandEmpty>{t('client.404')}</CommandEmpty>
                                                <CommandGroup>
                                                    {clients.length > 0 ? clients.map(client => (
                                                        <CommandItem
                                                            key={client.id}
                                                            className={`${selectedClientID === client.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                            value={client.username}
                                                            onSelect={() => {
                                                                setSelectedClientID(client.id)
                                                                setOpenClient(false)
                                                            }}
                                                        >
                                                            {client.username}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    selectedClientID === client.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    )) : <CommandItem>{t('client.404')}</CommandItem>}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className='flex w-full flex-col gap-1.5'>
                                    <Label>{t('card.h1')}</Label>
                                    <Popover open={openCard} onOpenChange={setOpenCard}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCard}
                                                className={cn(
                                                    "w-full justify-between",
                                                    !selectedCardID && "text-muted-foreground"
                                                )}
                                            >
                                                {selectedCardID
                                                    ? cards.find((card) => card.id === selectedCardID)?.name
                                                    : t('card.select.h1')}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder={t('card.search')}
                                                    className="h-9"
                                                />
                                                <CommandEmpty>{t('card.404')}</CommandEmpty>
                                                <CommandGroup>
                                                    {cards.length > 0 ? cards.map(card => (
                                                        <CommandItem
                                                            key={card.id}
                                                            className={`${selectedCardID === card.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                            value={card.name}
                                                            onSelect={() => {
                                                                setSelectedCardID(card.id)
                                                                setOpenCard(false)
                                                            }}
                                                        >
                                                            {card.name}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    selectedCardID === card.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    )) : <CommandItem>{t('card.404')}</CommandItem>}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className='mt-4 flex w-full items-center gap-5'>
                                    <Button type='button' variant={'ghost'} className='w-full' onClick={() => router.push('/admin/manage/card')} >{t('operation.cancel')}</Button>
                                    <SubmitButton msg={t('card.bind')} style='w-full' />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )

}

export default Page