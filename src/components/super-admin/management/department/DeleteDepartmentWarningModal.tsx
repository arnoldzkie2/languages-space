/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import SubmitButton from '@/components/global/SubmitButton';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Err from '@/components/global/Err';


const DeleteDepartmentWarningModal: React.FC = () => {

    const { departmentData, closeDeleteDepartment, deleteDepartment, deleteSingleDepartment } = useDepartmentStore()

    const tt = useTranslations('global')

    if (!deleteDepartment || !departmentData) return null

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-center bg-opacity-50 backdrop-blur-sm'>
            <Card className='flex flex-col gap-3 h-3/4 w-1/3'>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this department?</CardTitle>
                    <CardDescription><Err /></CardDescription>
                </CardHeader>
                <CardContent>
                    <form className='flex w-full flex-col gap-4' onSubmit={(e) => deleteSingleDepartment(e, departmentData.id)}>
                        <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                            <div>Department ID: <span className='font-normal text-muted-foreground'>{departmentData?.id}</span></div>
                            <div>{tt('name')}: <span className='font-normal text-muted-foreground'>{departmentData?.name}</span></div>
                        </div>
                        <div className='flex items-center w-full justify-end mt-5 gap-5'>
                            <Button variant={'ghost'} onClick={closeDeleteDepartment}>{tt('cancel')}</Button>
                            <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteDepartmentWarningModal;
