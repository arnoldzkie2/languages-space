/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { newOrderFormValue } from '@/lib/state/super-admin/orderStore'
import { OrderFormValue } from '@/lib/types/super-admin/orderType'
import { cn } from '@/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  params: {
    orderID: string
  }
}

const Page = ({ params }: Props) => {

  const session = useSession({
    required: true,
    onUnauthenticated() {
      signIn()
    },
  })

  const router = useRouter()
  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  const [openClient, setOpenClient] = useState(false)
  const [openCard, setOpenCard] = useState(false)
  const [formData, setFormData] = useState<OrderFormValue>(newOrderFormValue)
  const departmentID = useDepartmentStore(s => s.departmentID)

  const { isSideNavOpen, setIsLoading, setErr } = useGlobalStore()
  const { cards, getCards } = useAdminCardStore()
  const { getClients, clients } = useAdminClientStore()

  const updateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    try {

      const { quantity, name, express_number, note, invoice_number, selectedClientID, status, selectedCardID, price } = formData
      if (!Number(quantity)) return setErr('Quantity must be positive number')
      if (!selectedCardID) return setErr('Select Card')
      if (!selectedClientID) return setErr('Select Client')
      if (!price) return setErr("Price is required")

      setIsLoading(true)
      const { data } = await axios.patch('/api/orders', {
        quantity: Number(quantity), name, express_number,price,
        note, invoice_number, operator: 'Admin', status, cardID: selectedCardID, clientID: selectedClientID
      }, { params: { orderID: params.orderID } })

      if (data.ok) {
        setIsLoading(false)
        toast("Success! order updated.")
        router.push('/admin/manage/orders')
      }

    } catch (error: any) {
      setIsLoading(false)
      console.log(error);
      return setErr('Something went wrong')
    }
  }

  const retrieveOrder = async () => {
    try {

      const { data } = await axios.get("/api/orders", { params: { orderID: params.orderID } })
      if (data.ok) {
        data.data.selectedClientID = data.data.client.id
        data.data.selectedCardID = data.data.cardID
        setFormData(data.data)
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong")
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData, [name]: value
    }))
  };

  useEffect(() => {

    getClients()
    getCards()
    retrieveOrder()
  }, [departmentID])

  const clientHeaderSkeleton = (
    <Skeleton className='bw-32 h-5 rounded-3xl'></Skeleton>
  )

  return (
    <div className=''>

      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

        <nav className={`border-b h-20 flex items-center px-8 justify-between`}>
          <h1 className='font-black text-xl uppercase'>{t('order.update')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
            {session.status !== 'loading' ?
              <Link href={'/admin/manage/client'} className='flex items-center justify-center w-32 hover:text-primary cursor-pointer gap-1'>
                <div>{t('client.h1')}</div>
              </Link> : clientHeaderSkeleton}
            {session.status !== 'loading' ?
              <Link href={'/admin/manage/client/card'} className='flex items-center justify-center w-32 hover:text-primary cursor-pointer gap-1'>
                <div>{t('client-card.h1')}</div>
              </Link> : clientHeaderSkeleton}
            {session.status !== 'loading' ? <Link href={'/admin/manage/client/card/bind'} className='flex items-center gap-1 justify-center w-32 hover:text-primary cursor-pointer'>
              <div>{t('client.card.bind')}</div>
            </Link> : clientHeaderSkeleton}
          </ul>
        </nav>
        <div className='w-full px-8'>
          <Card className='w-1/3'>
            <CardHeader>
              <CardTitle>{t('order.update')}</CardTitle>
              <CardDescription><Err /></CardDescription>
            </CardHeader>
            <CardContent>
              <form className='w-full flex flex-col gap-10' onSubmit={updateOrder}>
                <div className='w-full flex gap-20'>

                  <div className='w-full flex flex-col gap-4'>

                    <Departments />

                    <div className='flex w-full flex-col gap-1.5'>
                      <Label>{tt('client')}</Label>
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
                              : t('client.select')}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
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
                      <Label>{tt('card')}</Label>
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
                              : t('client-card.select')}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder={t('client-card.search')}
                              className="h-9"
                            />
                            <CommandEmpty>{t('client-card.404')}</CommandEmpty>
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
                              )) : <CommandItem>{t('client-card.404')}</CommandItem>}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>


                    <div className='w-full flex flex-col gap-2'>
                      <Label htmlFor="quantity" >{tt('quantity')}</Label>
                      <Input required value={formData.quantity} onChange={handleChange} name='quantity' type="number" id='quantity' />
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                      <Label htmlFor="price" >{tt('price')}</Label>
                      <Input required value={formData.price} onChange={handleChange} name='price' type="number" id='price' />
                    </div>

                  </div>

                  <div className='w-full flex flex-col gap-4'>

                    <div className="w-full items-center gap-1.5">
                      <Label htmlFor="status">{tt('status')}</Label>
                      <Select onValueChange={(status) => setFormData(prev => ({ ...prev, status }))} value={formData.status}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={tt('select-status')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{tt('status')}</SelectLabel>
                            <SelectItem value="paid">{tt('paid')}</SelectItem>
                            <SelectItem value="confirmed">{tt('confirmed')}</SelectItem>
                            <SelectItem value="invoiced">{tt("invoiced")}</SelectItem>
                            <SelectItem value="settled">{tt('settled')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>


                    <div className='w-full flex flex-col gap-2'>
                      <Label htmlFor="note" >{tt('note')}</Label>
                      <Input value={formData.note} onChange={handleChange} name='note' type="text" id='note' />
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                      <Label htmlFor="invoice_number" >{tt('invoice')} {tt('optional')}</Label>
                      <Input value={formData.invoice_number} onChange={handleChange} name='invoice_number' type="text" id='invoice_number' />
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                      <Label htmlFor="express_number" >{tt('express')} {tt('optional')}</Label>
                      <Input value={formData.express_number} onChange={handleChange} name='express_number' type="text" id='express_number' />
                    </div>

                  </div>
                </div>
                <div className='flex items-center gap-10 w-1/2 self-end'>
                  <Button className='w-full' variant={'ghost'} type='button' onClick={() => router.push('/admin/manage/orders')}>{tt('cancel')}</Button>
                  <SubmitButton msg={tt('update')} style='w-full' />
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