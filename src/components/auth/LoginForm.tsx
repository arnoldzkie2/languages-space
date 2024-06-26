import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SubmitButton from '../global/SubmitButton'
import { useTranslations } from 'next-intl'
import useAuthStore from '@/lib/state/auth/authStore'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Success from '../global/Success'
import Err from '../global/Err'

const LoginForm = () => {

    const [isText, setIsText] = useState(false)
    const { loginUser, handleLoginForm, loginForm } = useAuthStore()
    const t = useTranslations()

    return (
        <form onSubmit={loginUser}>
            <Card>
                <CardHeader>
                    <CardTitle>{t('auth.login.h1')}</CardTitle>
                    <CardDescription>
                        {t('auth.login.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Success />
                    <Err />
                    <div className="space-y-1">
                        <Label htmlFor="name">{t('info.username')}</Label>
                        <Input
                            id="name"
                            value={loginForm.username}
                            onChange={handleLoginForm}
                            name="username"
                            placeholder={t('info.username')} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">{t('info.password')}</Label>
                        <div className="relative w-full">
                            <Input
                                type={isText ? 'text' : 'password'}
                                id="password"
                                value={loginForm.password}
                                onChange={handleLoginForm}
                                name="password"
                                placeholder={t('info.password')} />
                            {loginForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-2.5 right-3 text-muted-foreground' />}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton msg={t("auth.login.h1")} style="w-full" />
                </CardFooter>
            </Card>
        </form>
    )
}

export default LoginForm