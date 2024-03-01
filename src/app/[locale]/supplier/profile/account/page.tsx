/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { FormEvent, useEffect } from 'react'
import { usePathname, useRouter } from '@/lib/navigation'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import SupplierHeader from '@/components/supplier/SupplierHeader'
import SupplierProfile from '@/components/supplier/SupplierProfile'
import useGlobalStore from '@/lib/state/globalStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Err from '@/components/global/Err'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/global/SubmitButton'
import { Skeleton } from '@/components/ui/skeleton'
import Success from '@/components/global/Success'

const Page = () => {

  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const { supplier, setSupplier } = useSupplierStore()
  const { err, setErr, isLoading, setIsLoading, okMsg, setOkMsg, eye, toggleEye, locales } = useGlobalStore()
  const setPage = useSupplierStore(state => state.setPage)

  const updateSupplier = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { username, password, payment_info } = supplier!
      if (!username) return setErr('Username is required')
      if (username.length < 6) return setErr('Username is to short minimum 6 characters.')
      if (!password) return setErr('Password is required')

      setIsLoading(true)
      const { data } = await axios.patch('/api/supplier', { username, password, payment_info })

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
    setSupplier({ ...supplier!, [name]: value })
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

  useEffect(() => {
    setPage('account')
  }, [])

  const t = useTranslations()

  return (
    <>
      <SupplierHeader />
      <div className='px-5 md:flex-row lg:justify-center text-muted-foreground sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
        <SupplierProfile />
        <Card className='order-1 md:order-2 w-full lg:w-/2 xl:w-1/4'>
          <CardHeader>
            <CardTitle className='text-2xl'>{t('profile.account')}</CardTitle>
            <CardDescription><Err /><Success /></CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateSupplier} className='flex flex-col gap-6 w-full text-muted-foreground'>
              <Err />
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
              {supplier?.id ? <div className='flex flex-col w-full gap-1'>
                <Label htmlFor="username">{t('info.username')}</Label>
                <Input type="text" id='name' name='username' value={supplier.username} onChange={handleChange} />
              </div> : skeleton}

              {supplier?.id ? <div className='flex flex-col w-full gap-1 relative'>
                <Label htmlFor="password">{t('info.password')}</Label>
                <Input type={eye ? 'text' : 'password'} id='password' name='password' value={supplier.password} onChange={handleChange} />
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