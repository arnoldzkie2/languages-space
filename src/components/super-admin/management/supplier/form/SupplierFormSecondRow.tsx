
'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAdminPageStore from "@/lib/state/admin/adminPageStore"
import { SupplierFormDataProps } from "@/lib/types/super-admin/supplierTypes"
import { UploadButton } from "@/utils/uploadthing"
import { Department } from "@prisma/client"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { toast } from "sonner"

const SupplierFormSecondRow = (props: {
    handleChange: (e: any) => void
    formData: SupplierFormDataProps
    departments: Department[] | null
    setFormData: React.Dispatch<React.SetStateAction<SupplierFormDataProps>>
}) => {

    const { handleChange, formData, departments, setFormData } = props

    const admin = useAdminPageStore(s => s.admin)

    const handleCheckboxChange = (isChecked: boolean, deptId: string) => {
        if (isChecked) {
            // If checkbox is checked, add deptId to formData.departments
            setFormData(prevState => ({
                ...prevState,
                departments: [...prevState.departments, deptId]
            }));
        } else {
            // If checkbox is unchecked, remove deptId from formData.departments
            setFormData(prevState => ({
                ...prevState,
                departments: prevState.departments.filter(id => id !== deptId)
            }));
        }
    };

    const t = useTranslations()
    return (
        <div className='w-full flex flex-col gap-4'>


            <div className="w-full items-center gap-1.5">
                <Label>{t('info.gender.h1')}</Label>
                <Select onValueChange={(gender) => setFormData(prev => ({ ...prev, gender }))} value={formData.gender}>
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
            </div>

            <div className="w-full items-center gap-1.5">
                <Label>{t('info.employment.h1')}</Label>
                <Select onValueChange={(employment_status) => setFormData(prev => ({ ...prev, employment_status }))} value={formData.employment_status}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('operation.select')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t('info.employment.h1')}</SelectLabel>
                            <SelectItem value="full-time">{t("info.employment.full")}</SelectItem>
                            <SelectItem value="part-time">{t("info.employment.part")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex w-full items-center gap-2'>

                <div className="w-full items-center gap-1.5">
                    <Label>{t('balance.currency')}</Label>
                    <Select onValueChange={(currency) => setFormData(prev => ({ ...prev, currency }))} value={formData.currency}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('operation.select')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('balance.currency')}</SelectLabel>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="PHP">PHP (₱)</SelectItem>
                                <SelectItem value="RMB">RMB (¥)</SelectItem>
                                <SelectItem value="VND">VND (₫)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="payment_info">{t('balance.payment.address')}</Label>
                <Input value={formData.payment_address} onChange={handleChange} name='payment_address' type="text" id='payment_address' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="address">{t('info.address')} {t('global.optional')}</Label>
                <Input value={formData.address} onChange={handleChange} name='address' type="text" id='address' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="origin">{t('info.origin')} {t('global.optional')}</Label>
                <Input value={formData.origin} onChange={handleChange} name='origin' type="text" id='origin' />
            </div>

            {!admin && <div className='w-full flex flex-col gap-2'>
                <Label className='block font-medium'>{t('department.s')}</Label>
                {departments && departments.map((dept) => (
                    <div key={dept.id} className="flex items-center">
                        <Checkbox
                            onCheckedChange={(isChecked: boolean) => handleCheckboxChange(isChecked, dept.id)}
                            id={`department_${dept.id}`}
                            name={`department_${dept.id}`}
                            value={dept.id}
                            checked={formData.departments.includes(dept.id)}
                            className="mr-2"
                        />
                        <Label htmlFor={`department_${dept.id}`} className="mr-4">{dept.name}</Label>
                    </div>
                ))}
            </div>}

            <div className='flex items-center justify-between w-full mt-2'>

                <Image width={110} height={110} src={formData.profile_url || '/profile/profile.svg'} alt='Supplier Profile' className='border rounded-full' />

                <div className='flex flex-col gap-3 items-start'>
                    <span className='block'>{t('info.profile.image')}</span>
                    <UploadButton
                        appearance={{
                            button: 'bg-primary text-muted'
                        }}
                        endpoint="profileUploader"
                        onClientUploadComplete={(res) => {
                            if (res) {
                                setFormData(prevData => ({ ...prevData, profile_key: res[0].key, profile_url: res[0].url }))
                                toast("Upload Completed");
                            }
                        }}
                        onUploadError={(error: Error) => {
                            alert('Something went wrong.')
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SupplierFormSecondRow