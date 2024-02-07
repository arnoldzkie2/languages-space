'use client'
import ThemeToggle from '@/components/global/DarkmodeToggle'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

const Page = () => {

    const t = useTranslations('auth')
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <Card className='bg-card px-20 py-10 shadow flex flex-col gap-5'>
                <CardHeader>
                    <CardTitle>
                        <Alert variant="destructive">
                            <AlertTitle className='flex items-center gap-4'>
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                <div>{t('error')}</div>
                            </AlertTitle>
                        </Alert>
                    </CardTitle>
                </CardHeader>
                <CardContent className='w-full flex justify-center'>
                    <Button variant={'link'} onClick={() => signOut({ redirect: true, callbackUrl: '/auth' })}>{t('signin')}</Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page