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

interface Props {

    filteredTable: Admin[]

}

const AdminTable: React.FC<Props> = ({ filteredTable }) => {

    const { selectedAdmins, setSelectedAdmins, openDeleteAdminModal } = useAdminStore()
    const { operation, openOperation, closeOperation, selectedID, departmentID, skeleton } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

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

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope='col' className='px-6 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />
                    </th>
                    <th scope="col" className="px-6 py-3">{tt('name')}</th>
                    <th scope="col" className="px-6 py-3">{tt('phone')}</th>
                    <th scope="col" className="px-6 py-3">{tt('organization')}</th>
                    <th scope="col" className="px-6 py-3">{tt('origin')}</th>
                    <th scope="col" className="px-6 py-3">{tt('note')}</th>
                    <th scope="col" className="px-6 py-3">{tt('date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(admin => (
                        <tr className="bg-white border hover:bg-slate-50" key={admin.id}>
                            <td className='px-6 py-3'>
                                <input type="checkbox" id={admin.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(admin)}
                                    checked={selectedAdmins.some(selectedAdmins => selectedAdmins.id === admin.id)}
                                />
                            </td>
                            <td className="px-6 py-3">
                                <label htmlFor={admin.id} className='cursor-pointer h-5 w-36'>{admin.name}</label>
                            </td>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-32'>
                                    {admin.phone_number}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {admin.organization}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {admin.origin}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {admin.note}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(admin.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(admin.id)} />
                                <ul className={`${operation && selectedID === admin.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-32 shadow-lg border flex flex-col text-gray-600`}>
                                    <Link href={`/manage/admin/permissions/${admin.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('permissions')} <FontAwesomeIcon icon={faGear} /></Link>
                                    <Link href={`/manage/admin/update/${admin.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => openDeleteAdminModal(admin)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-md animate-pulse w-5 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-36 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                            </td>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default AdminTable;
