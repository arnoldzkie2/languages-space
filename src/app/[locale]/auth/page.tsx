/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/lib/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import useAuthStore from "@/lib/state/auth/authStore";
import * as XLSX from 'xlsx';
import axios from "axios";

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
                    signIn()
            }

        }
    }, [session])


    // const handleFileUpload = async (event: any) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = async (e: any) => {
    //             const data = new Uint8Array(e.target.result);
    //             const workbook = XLSX.read(data, { type: 'array' });

    //             // Assuming there's only one sheet in the Excel file
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];

    //             // Convert sheet to JSON
    //             const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //             const headers: any = json[0];

    //             const transformedData = json.slice(1).map((row: any) => {
    //                 const obj: any = {};
    //                 headers.forEach((header: any, index: any) => {
    //                     obj[header] = row[index];
    //                 });
    //                 return obj;
    //             });

    //             const finalData = transformedData.map((obj: any) => ({
    //                 name: obj.name,
    //                 username: obj.name,
    //                 phone_number: obj.phone_number,
    //                 gender: obj.gender === '男' ? 'male' : 'female',
    //                 password: obj.phone_number,
    //                 origin: 'Verbalace'
    //             }));

    //             // Filter out objects with duplicate name and phone number combinations
    //             const uniqueFinalData = finalData.filter((obj, index, self) =>
    //                 index === self.findIndex((t) => (
    //                     (t.username === obj.username && t.phone_number === obj.phone_number) || t.username === obj.username
    //                 ))
    //             );

    //             await Promise.all(uniqueFinalData.map(async (client) => {
    //                 axios.post('/api/client', {
    //                     name: client.name,
    //                     username: client.username,
    //                     phone_number: client.phone_number,
    //                     password: client.phone_number,
    //                     origin: client.origin,
    //                     departments: ['1e3d4b16-576f-4f9f-9d30-a197a3e5ab1d']
    //                 })
    //             }))
    //         };

    //         reader.readAsArrayBuffer(file);
    //     }
    // };


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
                    {/* <input type="file" onChange={handleFileUpload} /> */}

                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm department={department} agent={agent} />
                </TabsContent>
            </Tabs>
        </div >
    )
}

export default Page;
