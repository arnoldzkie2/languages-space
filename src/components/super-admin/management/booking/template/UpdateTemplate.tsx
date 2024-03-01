import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useCommentTemplateStore from '@/lib/state/super-admin/commentTemplateStore'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface Props {
    templateID: string
}

const UpdateTemplate = ({ templateID }: Props) => {

    const [open, setOpen] = useState(false)
    const t = useTranslations()

    const { templateFormData, setTemplateFormData, updateTemplates, getSingleTemplate } = useCommentTemplateStore()

    useEffect(() => {
        if (open) getSingleTemplate(templateID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateID, open])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("booking.comments.update")}</AlertDialogTitle>
                    <AlertDialogDescription><Err /></AlertDialogDescription>
                </AlertDialogHeader>
                <form className='flex flex-col w-full gap-5'
                    onSubmit={(e) => updateTemplates(e, setOpen, templateID)}
                >
                    <div className='flex items-center gap-5'>
                        <Select value={templateFormData.gender} onValueChange={gender => setTemplateFormData({ ...templateFormData, gender })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('info.gender.select')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('info.gender.h1')}</SelectLabel>
                                    <SelectItem value="male">{t('info.gender.male')}</SelectItem>
                                    <SelectItem value="female">{t('info.gender.female')}</SelectItem>
                                    <SelectItem value="others">{t('info.gender.others')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={templateFormData.user} onValueChange={user => setTemplateFormData({ ...templateFormData, user })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('info.user.select')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('user.h1')}</SelectLabel>
                                    <SelectItem value="client">{t('user.client')}</SelectItem>
                                    <SelectItem value="supplier">{t('user.supplier')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Textarea
                        value={templateFormData.message}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, message: e.target.value })}
                        placeholder={t('info.message')}
                        className='max-h-[400px]'
                    />

                    <AlertDialogFooter className='flex items-center gap-5'>
                        <Button type='button' variant={'ghost'} onClick={() => setOpen(false)}>{t('operation.close')}</Button>
                        <SubmitButton msg={t('operation.update')} />
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UpdateTemplate