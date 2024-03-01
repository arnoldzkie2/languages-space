'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SupplierFormDataProps } from "@/lib/types/super-admin/supplierTypes"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTranslations } from "next-intl"

const SupplierFormFirstRow = (props: {
    formData: SupplierFormDataProps,
    handleChange: (e: any) => void,
    handleTagInputChange: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    handleRemoveTag: (tag: string) => void
}) => {

    const { formData, handleChange, handleTagInputChange, handleRemoveTag } = props
    const t = useTranslations()

    return (
        <div className='w-full flex flex-col gap-4'>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="name">{t('info.name')}</Label>
                <Input required value={formData.name} onChange={handleChange} name='name' type="text" id='name' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="username">{t('info.username')}</Label>
                <Input required value={formData.username} onChange={handleChange} name='username' type="text" id='username' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="email">{t('info.email.h1')} {t('global.optional')}</Label>
                <Input value={formData.email} onChange={handleChange} name='email' type="email" id='email' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="password">{t('info.password')}</Label>
                <Input required value={formData.password} onChange={handleChange} name='password' type="text" id='password' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="phone">{t('info.phone')} {t('global.optional')}</Label>
                <Input value={formData.phone_number} onChange={handleChange} name='phone_number' type="text" id='phone' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="organization">{t('info.organization')} {t('global.optional')}</Label>
                <Input value={formData.organization} onChange={handleChange} name='organization' type="text" id='organization' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="note">{t('info.note')} {t('global.optional')}</Label>
                <Input value={formData.note} onChange={handleChange} name='note' type="text" id='note' />
            </div>

            <div className='w-full flex flex-col gap-2'>
                <Label htmlFor="tags" title='Enter to add tags'>{t('supplier.tags')} {t('global.optional')}</Label>
                <Input onKeyDown={handleTagInputChange} name='tags' type="text" id='tags' />
            </div>

            <div className='flex flex-col gap-3'>
                <span>{t('supplier.tags')}</span>

                <ul className='w-full flex items-center gap-5 flex-wrap'>
                    {formData.tags.map(item => (
                        <li key={item} onClick={() => handleRemoveTag(item)} className='border cursor-pointer bg-muted py-1 px-3 flex items-center gap-2'>
                            <div>{item}</div>
                            <FontAwesomeIcon icon={faXmark} />
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default SupplierFormFirstRow