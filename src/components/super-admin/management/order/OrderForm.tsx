import React, { useState } from 'react'
import Departments from '../Departments'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'
import { OrderFormValue } from '@/lib/types/super-admin/orderType'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { ClientProps } from '@/lib/state/super-admin/clientStore'
import { ClientCardList } from '@/lib/types/super-admin/clientCardType'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
    formData: OrderFormValue,
    setFormData: React.Dispatch<React.SetStateAction<OrderFormValue>>
    clients: ClientProps[]
    cards: ClientCardList[]
    handleChange: (e: any) => void
}

const OrderForm = ({ formData, clients, setFormData, cards, handleChange }: Props) => {
    const [openClient, setOpenClient] = useState(false)
    const [openCard, setOpenCard] = useState(false)

    const t = useTranslations()
    return (
        <div className='w-full flex gap-20'>

            <div className='w-full flex flex-col gap-4'>

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
                                    !formData.selectedClientID && "text-muted-foreground"
                                )}
                            >
                                {formData.selectedClientID
                                    ? clients.find((client) => client.id === formData.selectedClientID)?.username
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
                                            className={`${formData.selectedClientID === client.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            value={client.username}
                                            onSelect={() => {
                                                setFormData((prev) => ({ ...prev, selectedClientID: client.id }))
                                                setOpenClient(false)
                                            }}
                                        >
                                            {client.username}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    formData.selectedClientID === client.id ? "opacity-100" : "opacity-0"
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
                                    !formData.selectedCardID && "text-muted-foreground"
                                )}
                            >
                                {formData.selectedCardID
                                    ? cards.find((card) => card.id === formData.selectedCardID)?.name
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
                                            className={`${formData.selectedCardID === card.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            value={card.name}
                                            onSelect={() => {
                                                setFormData(prev => ({ ...prev, selectedCardID: card.id }))
                                                setOpenCard(false)
                                            }}
                                        >
                                            {card.name}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    formData.selectedCardID === card.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    )) : <CommandItem>{t('card.404')}</CommandItem>}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>


                <div className='w-full flex flex-col gap-2'>
                    <Label htmlFor="quantity" >{t('info.quantity')}</Label>
                    <Input required value={formData.quantity} onChange={handleChange} name='quantity' type="number" id='quantity' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <Label htmlFor="price" >{t('card.price')}</Label>
                    <Input required value={formData.price} onChange={handleChange} name='price' type="number" id='price' />
                </div>

            </div>

            <div className='w-full flex flex-col gap-4'>

                <div className="w-full items-center gap-1.5">
                    <Label htmlFor="status">{t('status.h1')}</Label>
                    <Select onValueChange={(status) => setFormData(prev => ({ ...prev, status }))} value={formData.status}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('status.select')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('status.h1')}</SelectLabel>
                                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                                <SelectItem value="paid">{t('status.paid')}</SelectItem>
                                <SelectItem value="invoiced">{t("status.invoiced")}</SelectItem>
                                <SelectItem value="settled">{t('status.settled')}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <Label htmlFor="note" >{t('info.note')}</Label>
                    <Input value={formData.note} onChange={handleChange} name='note' type="text" id='note' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <Label htmlFor="invoice_number" >{t('card.invoice')} {t('global.optional')}</Label>
                    <Input value={formData.invoice_number} onChange={handleChange} name='invoice_number' type="text" id='invoice_number' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <Label htmlFor="express_number" >{t('card.express')} {t('global.optional')}</Label>
                    <Input value={formData.express_number} onChange={handleChange} name='express_number' type="text" id='express_number' />
                </div>

            </div>
        </div>
    )
}

export default OrderForm