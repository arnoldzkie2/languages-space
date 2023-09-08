/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import useAdminClientStore from '@/lib/state/super-admin/clientStore';
import { Client } from '@/lib/types/super-admin/clientType';
import Link from 'next-intl/link'

interface Props {

    filteredTable: Client[]

}

const ClientTable: React.FC<Props> = ({ filteredTable }) => {

    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const { departmentID } = useAdminGlobalStore()

    const { selectedClients, setSelectedClients, viewClient, deleteWarning } = useAdminClientStore()

    const { operation, openOperation, closeOperation, selectedID } = useAdminGlobalStore()

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (client: Client) => {

        const isSelected = selectedClients.some((selectedClient) => selectedClient.id === client.id);

        if (isSelected) {

            const updatedSelectedClients = selectedClients.filter((selectedClient) => selectedClient.id !== client.id);

            setSelectedClients(updatedSelectedClients);

        } else {

            const updatedSelectedClients = [...selectedClients, client];

            setSelectedClients(updatedSelectedClients);

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: Client[];

        const isSelected = filteredTable.every((client) =>
            selectedClients.some((selectedClient) => selectedClient.id === client.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedClients = selectedClients.filter((selectedClient) =>
                filteredTable.every((client) => client.id !== selectedClient.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedClients = [
                ...selectedClients,
                ...filteredTable.filter(
                    (client) => !selectedClients.some((selectedClient) => selectedClient.id === client.id)
                ),
            ];
        }

        setSelectedClients(updatedSelectedClients);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((client) => client.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedClients.some((client) => client.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedClients, filteredTable]);

    useEffect(() => {

        setSelectedClients([])

    }, [departmentID])

    const t = useTranslations('super-admin')

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
                    <th scope="col" className="px-6 py-3">{t('client.name')}</th>
                    <th scope="col" className="px-6 py-3">{t('client.phone')}</th>
                    <th scope="col" className="px-6 py-3">{t('client.organization')}</th>
                    <th scope="col" className="px-6 py-3">{t('client.origin')}</th>
                    <th scope="col" className="px-6 py-3">{t('client.note')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(client => (
                        <tr className="bg-white border hover:bg-slate-50" key={client.id}>
                            <td className='px-6 py-3'>
                                <input type="checkbox" id={client.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(client)}
                                    checked={selectedClients.some(selectedClient => selectedClient.id === client.id)}
                                />
                            </td>
                            <td className="px-6 py-3">
                                <label htmlFor={client.id} className='cursor-pointer h-5 w-36'>{client.name}</label>
                            </td>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-32'>

                                    {client.phone_number ? client.phone_number : 'No Data'}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>

                                    {client.organization ? client.organization : 'No Data'}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {client.origin ? client.origin : 'No Data'}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {client.note ? client.note : 'No Data'}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(client.id)} />
                                <ul className={`${operation && selectedID === client.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' onClick={() => viewClient(client)}>{t('operation.view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/client/update/${client.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{t('operation.update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => deleteWarning(client)}>{t('operation.delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
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
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
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
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default ClientTable;
