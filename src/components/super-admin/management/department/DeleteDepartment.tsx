/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import SubmitButton from '@/components/global/SubmitButton';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Err from '@/components/global/Err';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Department } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';


interface Props {
    department: Department
}

const DeleteDepartment: React.FC<Props> = ({ department }) => {

    const { departmentData, deleteDepartment, deleteSingleDepartment } = useDepartmentStore()

    const [open, setOpen] = useState(false)

    const t = useTranslations()

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {t('operation.delete')}
                    <FontAwesomeIcon icon={faTrashCan} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("department.delete")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>ID: <span className='font-normal text-muted-foreground'>{department.id}</span></div>
                        <div>{t('info.name')}: <span className='font-normal text-muted-foreground'>{department.name}</span></div>
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{t('operation.close')}</Button>
                    <form onSubmit={(e) => deleteSingleDepartment(e, department.id)}>
                        <SubmitButton variant={'destructive'} msg={t('operation.confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    );
};

export default DeleteDepartment;
