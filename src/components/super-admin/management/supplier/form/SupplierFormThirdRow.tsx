'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SupplierFormDataProps } from "@/lib/types/super-admin/supplierTypes"
import { useTranslations } from "next-intl"

const SupplierFormThirdRow = (props: {
    meetingInfo: {
        service: string
        meeting_code: string
    }[],
    addMoreMeetingInfo: () => void,
    handleMeetinInfoChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void,
    removeMeetingInfo: (index: number) => void
    handleChange: (e: any) => void
    formData: SupplierFormDataProps
}) => {

    const t = useTranslations()

    return (
        <div className='flex flex-col gap-3 w-full'>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="salary">{t('info.salary')} {t('global.optional')}</Label>
                <Input value={props.formData.salary} onChange={props.handleChange} name='salary' type="number" id='salary' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="booking_rate">{t('balance.commission.rate')}</Label>
                <Input value={props.formData.booking_rate} onChange={props.handleChange} name='booking_rate' type="number" id='booking_rate' />
            </div>

            <h1 className='font-bold'>{t('meeting.h1')}</h1>
            {props.meetingInfo.map((info, index) => (
                <div key={index} className='flex flex-col gap-3 w-full p-4 border'>
                    <Input
                        type="text"
                        name="service"
                        placeholder={t('meeting.service')}
                        value={info.service}
                        onChange={(e) => props.handleMeetinInfoChange(e, index)}
                    />
                    <Input
                        type="text"
                        name="meeting_code"
                        placeholder={t('meeting.code')}
                        value={info.meeting_code}
                        onChange={(e) => props.handleMeetinInfoChange(e, index)}
                    />
                    <Button type='button' onClick={() => props.removeMeetingInfo(index)} className='w-full' variant={'destructive'}>{t('operation.remove')}</Button>
                </div>
            ))}
            <Button type='button' onClick={props.addMoreMeetingInfo} className='w-1/2 self-end mt-3' >{t("operation.add_more")}</Button>
        </div>
    )
}

export default SupplierFormThirdRow