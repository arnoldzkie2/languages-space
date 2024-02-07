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
    const t = useTranslations('auth')

    return (
        <form onSubmit={loginUser}>
            <Card>
                <CardHeader>
                    <CardTitle>{t('signin')}</CardTitle>
                    <CardDescription>
                        {t('login-description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Success />
                    <Err />
                    <div className="space-y-1">
                        <Label htmlFor="name">{t('username')}</Label>
                        <Input
                            id="name"
                            value={loginForm.username}
                            onChange={handleLoginForm}
                            name="username"
                            placeholder={t('username')} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">{t('password')}</Label>
                        <div className="relative w-full">
                            <Input
                                type={isText ? 'text' : 'password'}
                                id="password"
                                value={loginForm.password}
                                onChange={handleLoginForm}
                                name="password"
                                placeholder={t('password')} />
                            {loginForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-2.5 right-3 text-muted-foreground' />}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton msg={t("signin")} style="w-full" />
                </CardFooter>
            </Card>
        </form>
    )
}

export default LoginForm