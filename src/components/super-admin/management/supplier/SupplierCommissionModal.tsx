import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useSupplierCommissionStore from '@/lib/state/super-admin/supplierCommissionStore'
import { faPercent } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface Props {
    supplierName: string
    supplierID: string
}

const SupplierCommissionModal = ({ supplierName, supplierID }: Props) => {

    const [open, setOpen] = useState(false)
    const { commissions, retrieveSupplierCommission, updateSupplierCommission, setCommissions } = useSupplierCommissionStore()

    const tt = useTranslations("global")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const newValue = e.target.value;

        // Assuming commissions and setCommissions are part of your component state
        const updatedCommissions = commissions && commissions.map(obj => {
            if (obj.id === id) {
                return { ...obj, booking_rate: Number(newValue) };
            }
            return obj;
        }) || []

        // Call setCommissions to update the state with the modified commissions
        setCommissions(updatedCommissions);
    };

    useEffect(() => {
        if (open) retrieveSupplierCommission(supplierID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplierID, open])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex items-center w-full justify-between cursor-pointer hover:text-foreground'>
                    <div>{tt('commission')}</div>
                    <FontAwesomeIcon icon={faPercent} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-card'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{tt("supplier")}: {supplierName}</AlertDialogTitle>
                    <AlertDialogDescription>Edit Commissions</AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={(e) => updateSupplierCommission(e, supplierID, setOpen)} className='flex flex-col gap-3'>
                    <Err />
                    <div className='flex flex-col gap-3 max-h-[400px] overflow-y-auto'>
                        {commissions && commissions.length > 0 ? commissions.map(obj => (
                            <div key={obj.id} className='flex items-center gap-5'>
                                <Input type='number' value={obj.booking_rate} className='w-24' onChange={(e) => handleInputChange(e, obj.id)} />
                                <Label htmlFor={obj.id}>{obj.card.name}</Label>
                            </div>
                        )) : null}
                    </div>
                    <AlertDialogFooter className='flex items-center w-full gap-5'>
                        <Button type='button' variant={'ghost'} onClick={() => setOpen(false)}>{tt('close')}</Button>
                        <SubmitButton msg={tt("update")} />
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default SupplierCommissionModal