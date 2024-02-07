import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AdminPermission } from '@prisma/client';
import PermissionSwitch from './PermissionSwitch';

const FormCoursesPermission: React.FC<{
    handleCheckboxChange: (isChecked: boolean, name: string) => void
    permissionData: AdminPermission;
}> = (props) => {
    const { permissionData, handleCheckboxChange } = props;
    const t = useTranslations('super-admin');

    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='font-bold text-lg text-foreground'>{t('courses.h1')}</div>

            <PermissionSwitch
                label={t('admin.permissions.view_courses')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.view_courses}
                permissionKey='view_courses' />

            <PermissionSwitch
                label={t('admin.permissions.create_courses')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.create_courses}
                permissionKey='create_courses' />

            <PermissionSwitch
                label={t('admin.permissions.update_courses')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.update_courses}
                permissionKey='update_courses' />

            <PermissionSwitch
                label={t('admin.permissions.delete_courses')}
                onCheckedChange={handleCheckboxChange}
                checked={permissionData.delete_courses}
                permissionKey='delete_courses' />
    
        </div>
    );
};

export default FormCoursesPermission;
