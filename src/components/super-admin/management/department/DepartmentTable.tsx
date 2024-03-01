/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { Skeleton } from '@/components/ui/skeleton';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Department } from '@prisma/client';
import DeleteDepartment from './DeleteDepartment';

interface Props {
    filteredTable: Department[]
}

const DepartmentTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, selectedID, skeleton, openOperation, closeOperation } = useGlobalStore()
    const { openDeleteDepartment, openUpdateDepartment } = useDepartmentStore()
    const t = useTranslations()
    return (
        <table className="text-sm text-left shadow-md w-full text-muted-foreground">
            <thead className="text-xs uppercase bg-card border">
                <tr>
                    <th scope="col" className="px-6 py-3">{t('info.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('info.date.h1')}</th>
                    <th scope="col" className="px-6 py-3">{t('operation.h1')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(department => (
                        <tr className="bg-card border hover:bg-muted hover:text-foreground" key={department.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-36'>
                                    {department.name}
                                </div>
                            </td>

                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(department.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(department.id)} />
                                <ul className={`${operation && selectedID === department.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-muted-foreground`}>
                                    <li onClick={() => openUpdateDepartment(department)} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></li>
                                    <DeleteDepartment department={department} />
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item} className='border bg-card'>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
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
        </table >
    );
};

export default DepartmentTable;
