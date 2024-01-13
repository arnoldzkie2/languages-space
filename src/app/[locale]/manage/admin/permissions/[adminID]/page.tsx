'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import Success from '@/components/global/Success'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import FormAdminPermission from '@/components/super-admin/management/admin/permissionForm/FormAdminPermission'
import FormAgentPermission from '@/components/super-admin/management/admin/permissionForm/FormAgentPermission'
import FormBookingPermission from '@/components/super-admin/management/admin/permissionForm/FormBookingPermission'
import FormCardsPermission from '@/components/super-admin/management/admin/permissionForm/FormCardPermission'
import FormClientPermission from '@/components/super-admin/management/admin/permissionForm/FormClientPermission'
import FormCoursesPermission from '@/components/super-admin/management/admin/permissionForm/FormCoursesPermission'
import FormDepartmentPermission from '@/components/super-admin/management/admin/permissionForm/FormDepartmentPermission'
import FormWebNewsPermission from '@/components/super-admin/management/admin/permissionForm/FormNewsPermission'
import FormOrdersPermission from '@/components/super-admin/management/admin/permissionForm/FormOrderPermission'
import FormOtherPermission from '@/components/super-admin/management/admin/permissionForm/FormOtherPermission'
import FormRemindersPermission from '@/components/super-admin/management/admin/permissionForm/FormReminderPermission'
import FormSupplierSchedulePermission from '@/components/super-admin/management/admin/permissionForm/FormSchedulePermission'
import FormSupplierPermission from '@/components/super-admin/management/admin/permissionForm/FormSupplierPermission'
import { Link } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminPermissionStore from '@/lib/state/super-admin/adminPermissionStore'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AdminPermission } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { ChangeEvent, useEffect } from 'react'

interface Props {
    params: {
        adminID: string
    }
}

interface CreatePermissionButtonProps {
    msg: string, adminID: string,
    showCreatePermissionButton: boolean,
    createPermission: (e: React.FormEvent<Element>, adminID: string) => Promise<void>
}

interface ReturnPermissionFormDataProps {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void
    permissionData: AdminPermission | null
    updatePermission: (e: React.FormEvent<Element>, adminID: string) => Promise<void>
    adminID: string
    isLoading: boolean
    deleteAgentPermission: (e: React.MouseEvent<Element, MouseEvent>) => Promise<void>
}

const Page = ({ params }: Props) => {

    const { status } = useSession()
    const adminID = params.adminID
    const { isSideNavOpen, departmentID, isLoading } = useGlobalStore()
    const { createPermission,
        retrieveAdminPermission,
        showCreatePermissionButton,
        permissionData,
        setPermissionData,
        setShowCreatePermissionButton,
        clearPermissionData,
        updatePermission, deleteAgentPermission } = useAdminPermissionStore()

    useEffect(() => {
        clearPermissionData()
        setShowCreatePermissionButton(false)
        if (adminID && departmentID) retrieveAdminPermission(adminID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentID])

    const t = useTranslations('super-admin')

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setPermissionData({ ...permissionData!, [name]: checked });
    };

    const skeleton = (
        <li className='bg-slate-200 animate-pulse w-40 h-5 rounded-3xl'></li>
    )

    return (
        <>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-40' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('admin.permissions.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {status !== 'loading' ?
                            <Link href={'/manage/admin/new'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('admin.create')}</div>
                            </Link> : skeleton}
                        {status !== 'loading' ?
                            <Link href={'/manage/admin'} className='flex items-center text-gray-600 justify-center w-40 hover:text-blue-600 cursor-pointer gap-1'>
                                <div>{t('admin.h1')}</div>
                            </Link> : skeleton}
                    </ul>
                </nav>

                <div className='w-full px-8'>
                    <div className='w-1/2 flex flex-col gap-10 bg-white text-gray-600 p-10 border'>
                        <Err />
                        <Success />
                        <div className='w-full flex flex-col gap-10'>
                            <div className='flex flex-col gap-5 w-1/3'>
                                <Departments />
                                {!departmentID &&
                                    <div>
                                        {t('global.department.select-department')}
                                    </div>}
                                <CreatePermissionButton
                                    adminID={adminID}
                                    msg={t('admin.create-permission')}
                                    showCreatePermissionButton={showCreatePermissionButton}
                                    createPermission={createPermission}
                                />
                            </div>
                            <div className='w-full'>
                                <ReturnPermissionFormData
                                    isLoading={isLoading}
                                    handleChange={handleChange}
                                    updatePermission={updatePermission}
                                    adminID={adminID}
                                    permissionData={permissionData}
                                    deleteAgentPermission={deleteAgentPermission}
                                />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

const CreatePermissionButton = (props: CreatePermissionButtonProps) => {

    const { msg, showCreatePermissionButton, createPermission, adminID } = props

    //return null if this is false
    if (!showCreatePermissionButton) return null

    return (
        <form onSubmit={(e) => createPermission(e, adminID)}>
            <SubmitButton msg={msg} style='bg-blue-600 w-full py-2 rounded-md text-white' />
        </form>
    )
}

const ReturnPermissionFormData: React.FC<ReturnPermissionFormDataProps> = (props) => {
    const { permissionData, handleChange, updatePermission, adminID, isLoading, deleteAgentPermission } = props;

    const tt = useTranslations('global')
    // Check if permissionData is null
    if (!permissionData) return null;

    // Extract the permission keys from the AdminPermission model
    const permissionKeys = Object.keys(permissionData) as (keyof AdminPermission)[];

    // Group permissions by their common suffix
    const groupedPermissions: Record<string, string[]> = {};
    permissionKeys.forEach((key) => {
        const match = key.match(/_(\w+)$/);
        if (match) {
            const suffix = match[1];
            if (!groupedPermissions[suffix]) {
                groupedPermissions[suffix] = [];
            }
            groupedPermissions[suffix].push(key);
        }
    });

    return (
        <form onSubmit={(e) => updatePermission(e, adminID)} className='w-full flex gap-10 flex-col'>
            <div className='flex w-full gap-40'>
                <FormClientPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
                <FormSupplierPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
            </div>

            <div className='flex w-full gap-40'>
                <FormAgentPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
                <FormBookingPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
            </div>
            <div className='flex w-full gap-40'>

                <FormCardsPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />

                <FormSupplierSchedulePermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
            </div>

            <div className='flex w-full gap-40'>

                <FormCoursesPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />

                <FormOrdersPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
            </div>

            <div className='flex w-full gap-40'>

                <FormAdminPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />

                <FormWebNewsPermission
                    handleChange={handleChange}
                    permissionData={permissionData} />
            </div>

            <div className='flex w-full gap-40'>

                <FormRemindersPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />

                <FormDepartmentPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
            </div>

            <div className='flex w-full gap-40'>
                <FormOtherPermission
                    handleChange={handleChange}
                    permissionData={permissionData}
                />
                <div className='w-1/2'>
                </div>
            </div>
            <Success />
            <div className='w-full flex items-center gap-10 justify-end'>
                <button
                    onClick={(e) => deleteAgentPermission(e)}
                    disabled={isLoading}
                    className={`${isLoading ? 'bg-opacity-80 bg-red-600' : 'bg-red-600 hover:bg-opacity-80'}
                     py-2 w-1/4 text-white rounded-md`} type='button'>
                    {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16}
                        className='animate-spin' /> : tt('delete')}
                </button>
                <SubmitButton style='bg-blue-600 w-1/4 py-2 rounded-md text-white ' msg={tt('update')} />
            </div>

        </form>

    );
};


export default Page