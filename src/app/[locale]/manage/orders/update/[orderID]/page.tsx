/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import useAdminCardStore from '@/lib/state/super-admin/cardStore'
import useAdminClientCardStore from '@/lib/state/super-admin/clientCardStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import { newOrderFormValue } from '@/lib/state/super-admin/orderStore'
import { OrderFormValue } from '@/lib/types/super-admin/orderType'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

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

  const { orderID } = params
  const router = useRouter()
  const t = useTranslations('super-admin')
  const tt = useTranslations('global')

  const [searchClient, setSearchClient] = useState('')
  const [searchCard, setSearchCard] = useState('')
  const [err, setErr] = useState('')
  const [formData, setFormData] = useState<OrderFormValue>(newOrderFormValue)

  const { isSideNavOpen, isLoading, setIsLoading } = useAdminGlobalStore()
  const { cards, getCards } = useAdminCardStore()
  const { getClients, clients } = useAdminClientStore()

  const filterClient = clients.filter(client => client.name.toUpperCase().includes(searchClient.toUpperCase()))
  const filterCard = cards.filter(card => card.name.toUpperCase().includes(searchCard.toUpperCase()))

  const retrieveOrder = async () => {
    try {

      const { data } = await axios.get('/api/orders', {
        params: { orderID }
      })
      if (data.ok) setFormData(data.data)

    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  }

  const updateOrder = async (e: any) => {
    e.preventDefault()
    try {

      const { quantity, name, express_number, note, invoice_number, client, status, card } = formData

      if (Number(quantity) < 1) return setErr('Quantity must be positive number')
      if (!card) return setErr('Select Card')
      if (!client) return setErr('Select Client')

      setIsLoading(true)

      const { data } = await axios.patch('/api/orders', {
        quantity: Number(quantity), name, express_number,
        note, invoice_number, operator: 'Admin', status, cardID: card.id, clientID: client.id
      }, {
        params: { orderID }
      })

      if (data.ok) {
        setIsLoading(false)
        router.push('/manage/orders')
      }

    } catch (error: any) {
      setIsLoading(false)
      console.log(error);
      return setErr('Something went wrong')
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData, [name]: value
    }))
  };

  useEffect(() => {
    retrieveOrder()
    getClients()
    getCards()
  }, [])

  const clientHeaderSkeleton = (
    <li className='bg-slate-200 w-32 h-5 rounded-3xl animate-pulse'></li>
  )

  return (
    <div className=''>

      <SideNav />

      <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

        <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
          <h1 className='font-black text-gray-600 text-xl uppercase'>{t('order.update')}</h1>
          <ul className='flex items-center h-full ml-auto gap-5'>
            {session.status !== 'loading' ?
              <Link href={'/manage/client'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                <div>{t('client.h1')}</div>
              </Link> : clientHeaderSkeleton}
            {session.status !== 'loading' ?
              <Link href={'/manage/client/card'} className='flex items-center text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer gap-1'>
                <div>{t('client-card.h1')}</div>
              </Link> : clientHeaderSkeleton}
            {session.status !== 'loading' ? <Link href={'/manage/client/card/bind'} className='flex items-center gap-1 text-gray-600 justify-center w-32 hover:text-blue-600 cursor-pointer'>
              <div>{t('client.card.bind')}</div>
            </Link> : clientHeaderSkeleton}
          </ul>
        </nav>
        <div className='w-full px-8'>
          <form className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border' onSubmit={updateOrder}>
            {err && <small className='w-full text-red-400'>{err}</small>}
            <div className='w-full flex gap-20'>

              <div className='w-full flex flex-col gap-4'>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="client_name" className='font-medium px-2'>{t('client.select')}</label>
                  <div className='relative'>
                    <input value={searchClient} onChange={(e) => setSearchClient(e.target.value)} type="text" className='w-full border outline-none py-1 px-3' id='client_name' />
                    <ul className={`flex-col absolute bg-slate-50 shadow w-full ${searchClient ? 'flex' : 'hidden'}`}>
                      {filterClient.map(client => (
                        <li key={client.id} title='Select' className='w-full p-2 cursor-pointer hover:bg-slate-100' onClick={() => {
                          setSearchClient('')
                          setFormData(prevData => ({ ...prevData, client: client }))
                        }}>{client.name} ({client.username})</li>
                      ))}
                    </ul>
                  </div>
                  {formData.client && <small>Client: {formData.client.name} ({formData.client.username})</small>}
                </div>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="card" className='font-medium px-2'>{t('client-card.select')}</label>
                  <div className='relative'>
                    <input value={searchCard} onChange={(e) => setSearchCard(e.target.value)} type="text" className='w-full border outline-none py-1 px-3' id='card' />
                    <ul className={`flex-col absolute bg-slate-50 shadow w-full ${searchCard ? 'flex' : 'hidden'}`}>
                      {filterCard.map(card => (
                        <li key={card.id} title='Select' className='w-full p-2 flex items-center cursor-pointer hover:bg-slate-100' onClick={() => {
                          setSearchCard('')
                          setFormData(prevData => ({ ...prevData, card: card }))
                        }}>{card.name}
                          <div className='ml-auto flex items-center'>
                            <span>({card.balance})</span>
                            <span className='pl-2 ml-2 border-l'>¥{card.price}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {formData.card && <small>Card: {formData.card.name} ({formData.card.balance}) - ¥{formData.card.price}</small>}
                </div>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="quantity" className='font-medium px-2'>{t('client-card.quantity')}</label>
                  <input required value={formData.quantity} onChange={handleChange} name='quantity' type="number" className='w-full border outline-none py-1 px-3' id='quantity' />
                </div>
              </div>

              <div className='w-full flex flex-col gap-4'>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="status" className='font-medium px-2'>{tt('status')}</label>
                  <input required value={formData.status} onChange={handleChange} name='status' type="text" className='w-full border outline-none py-1 px-3' id='status' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="note" className='font-medium px-2'>{tt('note')}</label>
                  <input value={formData.note} onChange={handleChange} name='note' type="text" className='w-full border outline-none py-1 px-3' id='note' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="invoice_number" className='font-medium px-2'>{tt('invoice')} (optional)</label>
                  <input value={formData.invoice_number} onChange={handleChange} name='invoice_number' type="text" className='w-full border outline-none py-1 px-3' id='invoice_number' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="express_number" className='font-medium px-2'>{tt('express')} (optional)</label>
                  <input value={formData.express_number} onChange={handleChange} name='express_number' type="text" className='w-full border outline-none py-1 px-3' id='express_number' />
                </div>

                <div className='w-full flex flex-col gap-2'>
                  <label htmlFor="price" className='font-medium px-2'>{tt('price')}</label>
                  <input type="text" readOnly value={`¥ ${formData.card && formData.card.price * Number(formData.quantity) || ''}`} className='w-full border outline-none py-1 px-3' />
                </div>
              </div>
            </div>
            <div className='flex items-center gap-10 w-1/2 self-end'>
              <Link href={'/manage/orders'} className='flex items-center justify-center w-full h-10 rounded-md hover:bg-slate-200 border'>{tt('cancel')}</Link>
              <button disabled={isLoading && true}
                className={`w-full h-10 flex items-center justify-center ${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-md`}>
                {isLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' width={16} height={16} /> : tt('create')}</button>
            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default Page