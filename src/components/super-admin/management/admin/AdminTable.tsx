/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useGlobalStore from '@/lib/state/globalStore';
import { Admin } from '@prisma/client';
import useAdminStore from '@/lib/state/super-admin/adminStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteSingeAdminAlert from './DeleteSingleAdminALert';
import DeleteSelectedAdminAlert from './DeleteSelectedAdminAlert';
import ViewAdminAlert from './ViewAdminAlert';

interface Props {
    filteredTable: Admin[]
}

const AdminTable: React.FC<Props> = ({ filteredTable }) => {

    const { selectedAdmins, setSelectedAdmins, openDeleteAdminModal } = useAdminStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const departmentID = useDepartmentStore(s => s.departmentID)
    const handleSelection = (admin: Admin) => {

        const isSelected = selectedAdmins.some((selectedAdmins) => selectedAdmins.id === admin.id);

        if (isSelected) {

            const updatedSelectedAdmin = selectedAdmins.filter((selectedAdmins) => selectedAdmins.id !== admin.id);
            setSelectedAdmins(updatedSelectedAdmin);

        } else {

            const updatedSelectedAdmin = [...selectedAdmins, admin];
            setSelectedAdmins(updatedSelectedAdmin);

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedAdmin: Admin[]

        const isSelected = filteredTable.every((admin) =>
            selectedAdmins.some((selectedAdmins) => selectedAdmins.id === admin.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedAdmin = selectedAdmins.filter((selectedAdmins) =>
                filteredTable.every((admin) => admin.id !== selectedAdmins.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedAdmin = [
                ...selectedAdmins,
                ...filteredTable.filter(
                    (admin) => !selectedAdmins.some((selectedAdmins) => selectedAdmins.id === admin.id)
                ),
            ];
        }

        setSelectedAdmins(updatedSelectedAdmin);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((admin) => admin.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedAdmins.some((admin) => admin.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedAdmins, filteredTable]);

    useEffect(() => {

        setSelectedAdmins([])

    }, [departmentID])

    const t = useTranslations()

    return (
        <div className='flex flex-col w-full'>
            <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                <thead className="text-xs uppercase bg-card border">
                    <tr>
                        <th scope='col' className='px-6 py-3'>
                            <Checkbox
                                className='cursor-pointer w-4 h-4 outline-none'
                                title='Select all 10 rows'
                                checked={isRowChecked}
                                onCheckedChange={selectAllRows}
                            />
                        </th>
                        <th scope="col" className="px-6 py-3">{t('info.name')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.phone')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.organization')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.origin')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.note')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.date.h1')}</th>
                        <th scope="col" className="px-6 py-3">{t('operation.h1')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(admin => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={admin.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox id={admin.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(admin)}
                                        checked={selectedAdmins.some(selectedAdmins => selectedAdmins.id === admin.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    <label htmlFor={admin.id} className='cursor-pointer h-5 w-36'>{admin.name}</label>
                                </td>
                                <td className="px-6 py-3">
                                    {admin.phone_number && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(admin.phone_number || '')} >
                                        {returnTruncateText(admin.phone_number, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {admin.organization && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(admin.organization || '')} >
                                        {returnTruncateText(admin.organization, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {admin.origin && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(admin.origin || '')} >
                                        {returnTruncateText(admin.origin, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {admin.note && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(admin.note || '')} >
                                        {returnTruncateText(admin.note, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-44'>
                                        {new Date(admin.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className='py-3 relative px-6'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-foreground' onClick={() => openOperation(admin.id)} />
                                    <ul className={`${operation && selectedID === admin.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-32 shadow-lg border flex flex-col text-muted-foreground`}>
                                        <ViewAdminAlert adminID={admin.id} />
                                        <Link href={`/admin/manage/admin/permissions/${admin.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{t('admin.permissions.h1')} <FontAwesomeIcon icon={faGear} /></Link>
                                        <Link href={`/admin/manage/admin/update/${admin.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                        <DeleteSingeAdminAlert admin={admin} />
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                                    </ul>
                                </td>
                            </tr>
                        )) :
                        skeleton.map(item => (
                            <tr key={item} className='border bg-card'>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-md w-5 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                                </td>
                            </tr>
                        ))
                    }
                </tbody >
                <TruncateTextModal />
            </table >
            <DeleteSelectedAdminAlert />
        </div>

    );
};

export default AdminTable;
