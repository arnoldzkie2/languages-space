'use client'
import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import Success from '@/components/global/Success'
import SideNav from '@/components/super-admin/SideNav'
import Departments from '@/components/super-admin/management/Departments'
import FormAgentPermission from '@/components/super-admin/management/admin/permissionForm/FormAgentPermission'
import FormBookingPermission from '@/components/super-admin/management/admin/permissionForm/FormBookingPermission'
import FormCardsPermission from '@/components/super-admin/management/admin/permissionForm/FormCardPermission'
import FormClientPermission from '@/components/super-admin/management/admin/permissionForm/FormClientPermission'
import FormCoursesPermission from '@/components/super-admin/management/admin/permissionForm/FormCoursesPermission'
import FormWebNewsPermission from '@/components/super-admin/management/admin/permissionForm/FormNewsPermission'
import FormOrdersPermission from '@/components/super-admin/management/admin/permissionForm/FormOrderPermission'
import FormOtherPermission from '@/components/super-admin/management/admin/permissionForm/FormOtherPermission'
import FormRemindersPermission from '@/components/super-admin/management/admin/permissionForm/FormReminderPermission'
import FormSupplierSchedulePermission from '@/components/super-admin/management/admin/permissionForm/FormSchedulePermission'
import FormSupplierPermission from '@/components/super-admin/management/admin/permissionForm/FormSupplierPermission'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/lib/navigation'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminPermissionStore from '@/lib/state/super-admin/adminPermissionStore'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
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
    handleCheckboxChange: (isChecked: boolean, name: string) => void
    permissionData: AdminPermission | null
    updatePermission: (e: React.FormEvent<Element>, adminID: string) => Promise<void>
    adminID: string
    isLoading: boolean
    deleteAgentPermission: (e: React.MouseEvent<Element, MouseEvent>) => Promise<void>
}

const Page = ({ params }: Props) => {

    const { status } = useSession()
    const adminID = params.adminID
    const { isSideNavOpen, isLoading } = useGlobalStore()
    const departmentID = useDepartmentStore(s => s.departmentID)
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

    const handleCheckboxChange = (isChecked: boolean, name: string) => {
        setPermissionData({ ...permissionData!, [name]: isChecked })
    }

    const skeleton = (
        <Skeleton className=' w-40 h-5 rounded-3xl'></Skeleton>
    )

    return (
        <>

            <SideNav />

            <div className={`flex flex-col h-full pb-8 w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-16 flex items-center px-8 justify-between`}>
                    <h1 className='font-black text-xl uppercase'>{t('admin.permissions.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5 text-muted-foreground'>
                        {status !== 'loading' ?
                            <Link href={'/admin/manage/admin/new'} className='flex items-center hover:text-primary justify-center w-40 cursor-pointer gap-1'>
                                <div>{t('admin.create')}</div>
                            </Link> : skeleton}
                        {status !== 'loading' ?
                            <Link href={'/admin/manage/admin'} className='flex items-center hover:text-primary justify-center w-40 cursor-pointer gap-1'>
                                <div>{t('admin.h1')}</div>
                            </Link> : skeleton}
                    </ul>
                </nav>

                <div className='w-full px-8'>

                    <Card className='w-2/5'>
                        <CardHeader>
                            <CardTitle>{t('admin.permissions.h1')}</CardTitle>
                            <CardDescription><Err /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='w-full flex flex-col gap-10 text-muted-foreground'>
                                <div className='w-full flex flex-col gap-10'>
                                    <div className='flex flex-col gap-5 w-1/3'>
                                        <Departments />
                                        {!departmentID && <div className='px-3 pt-3 text-foreground'>{t('department.select')}</div>}
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
                                            handleCheckboxChange={handleCheckboxChange}
                                            updatePermission={updatePermission}
                                            adminID={adminID}
                                            permissionData={permissionData}
                                            deleteAgentPermission={deleteAgentPermission}
                                        />
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>


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
            <SubmitButton msg={msg} style='w-full' />
        </form>
    )
}

const ReturnPermissionFormData: React.FC<ReturnPermissionFormDataProps> = (props) => {
    const { permissionData, updatePermission, adminID, isLoading, deleteAgentPermission, handleCheckboxChange } = props;

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
        <form onSubmit={(e) => updatePermission(e, adminID)} className='w-full'>

            <div className='flex flex-col gap-10 w-full'>
                <div className='flex w-full gap-10'>
                    <div className='w-full flex flex-col gap-5'>
                        <FormClientPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormCardsPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormCoursesPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormOrdersPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormSupplierSchedulePermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormWebNewsPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData} />
                        <FormOtherPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                    </div>
                    <div className='w-full flex flex-col gap-5'>
                        <FormAgentPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormSupplierPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />
                        <FormBookingPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />


                        <FormRemindersPermission
                            handleCheckboxChange={handleCheckboxChange}
                            permissionData={permissionData}
                        />

                    </div>
                </div>
                <div className='w-full flex items-center gap-10 justify-end'>
                    <Button
                        onClick={(e) => deleteAgentPermission(e)}
                        disabled={isLoading}
                        variant={'destructive'}
                        className='w-1/4'
                        type='button'>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16}
                            className='animate-spin' /> : tt('delete')}
                    </Button>
                    <SubmitButton style='w-1/4' msg={tt('update')} />
                </div>
            </div>

        </form>

    );
};


export default Page