/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/lib/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import useAuthStore from "@/lib/state/auth/authStore";

interface Props {
    searchParams: {
        department: string
        agent: string
    }
}

const Page = ({ searchParams }: Props) => {

    const { agent, department } = searchParams
    const router = useRouter()
    const session = useSession()

    const authPage = useAuthStore(s => s.authPage)
    const setAuthPage = useAuthStore(s => s.setAuthPage)

    const t = useTranslations('auth')

    useEffect(() => {
        if (session.status === 'authenticated') {
            switch (session.data.user.type) {
                case 'client':
                    router.push('/client')
                    break;
                case 'super-admin':
                    router.push('/admin')
                    break;
                case 'admin':
                    router.push('/admin')
                    break;
                case 'agent':
                    router.push('/agent/invite')
                    break;
                case 'supplier':
                    router.push('/supplier/schedule')
                    break;
                default:
                    signOut()
            }

        }
    }, [session])

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-4xl'>LANGUAGES-SPACE</h1>
            <Tabs defaultValue="signin" value={authPage} onValueChange={(page) => setAuthPage(page)} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">{t('login.h1')}</TabsTrigger>
                    <TabsTrigger value="signup">{t('signup.h1')}</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm department={department} agent={agent} />
                </TabsContent>
            </Tabs>
        </div >
    )
}

export default Page;
