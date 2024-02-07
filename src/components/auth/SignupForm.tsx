import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SubmitButton from '../global/SubmitButton'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useTranslations } from 'next-intl'
import useAuthStore from '@/lib/state/auth/authStore'
import Success from '../global/Success'
import Err from '../global/Err'

interface SignupProps {
    department?: string
    agent?: string
}

const SignupForm = ({ department, agent }: SignupProps) => {

    const t = useTranslations('auth')
    const { signupForm, handleSignupForm, signupUser } = useAuthStore()
    const [isText, setIsText] = useState(false)
    return (
        <form onSubmit={(e) => signupUser(e, { department, agent })}>
            <Card>
                <CardHeader>
                    <CardTitle>{t('signup')}</CardTitle>
                    <CardDescription>
                        {t('signup-description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Success />
                    <Err />
                    <div className="space-y-1">
                        <Label htmlFor="username">{t('username')}</Label>
                        <Input
                            id="username"
                            value={signupForm.username}
                            onChange={handleSignupForm}
                            name="username"
                            placeholder={t('username')} />
                    </div>
                    <div className="relative w-full">
                        <Label htmlFor="password">{t('password')}</Label>
                        <Input
                            type={isText ? 'text' : 'password'}
                            id="password"
                            value={signupForm.password}
                            onChange={handleSignupForm}
                            name="password"
                            placeholder={t('password')} />
                        {signupForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-[35px] right-3 text-muted-foreground' />}
                    </div>
                    <div className="relative w-full">
                        <Label htmlFor="confirm_password">{t('confirm_password')}</Label>
                        <Input
                            type={isText ? 'text' : 'password'}
                            id="confirm_password"
                            value={signupForm.confirm_password}
                            onChange={handleSignupForm}
                            name="confirm_password"
                            placeholder={t('confirm_password')} />
                        {signupForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-[35px] right-3 text-muted-foreground' />}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton msg={t('signup')} style="w-full" />
                </CardFooter>
            </Card>
        </form>

    )
}

export default SignupForm