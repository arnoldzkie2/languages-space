import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminNewsStore from '@/lib/state/super-admin/newsStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteSelectedNewsAlert = () => {

    const [open, setOpen] = useState(false)
    const { getNews, setSelectedNews, selectedNews } = useAdminNewsStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedOrders = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const newsId = selectedNews.map((news) => news.id);
            const queryString = newsId.map((id) => `newsID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/news?${queryString}`)

            if (data.ok) {
                getNews()
                setSelectedNews([])
                setIsLoading(false)
                toast("Success! suppliers deleted.")
                setOpen(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")

    if (selectedNews.length < 1) return null

    return (
        <div className='p-3 border bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{tt("delete-all")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("news.delete")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                        {selectedNews.map(news => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={news.id}>
                                <div>ID: <span className='font-normal text-muted-foreground'>{news.id}</span></div>
                                <div>{tt('title')}: <span className='font-normal text-muted-foreground'>{news.title}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                        <form onSubmit={deleteSelectedOrders}>
                            <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedNewsAlert