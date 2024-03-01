import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useCommentTemplateStore from '@/lib/state/super-admin/commentTemplateStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteSelectedTemplates = () => {

    const [open, setOpen] = useState(false)
    const { selectedTemplates, getAllTemplates, setSelectedTemplates } = useCommentTemplateStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedTemplates = async (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const bookingIds = selectedTemplates.map((bookings) => bookings.id);
            const queryString = bookingIds.map((id) => `templateID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/booking/comments/template?${queryString}`)

            if (data.ok) {
                getAllTemplates()
                toast("Success! templates deleted.")
                setSelectedTemplates([])
                setIsLoading(false)
                setOpen(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    const t = useTranslations()

    if (selectedTemplates.length < 1) return null
    return (
        <div className='border py-3 px-6 bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{t('operation.delete_all')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('booking.comments.delete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                        {selectedTemplates.map(template => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={template.id}>
                                <div>{t("info.id")}: <span className='font-normal text-muted-foreground'>{template.id}</span></div>
                                <div>{t('info.message')}: <span className='font-normal text-muted-foreground'>{template.message}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                        <form onSubmit={(e) => deleteSelectedTemplates(e, setOpen)}>
                            <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedTemplates