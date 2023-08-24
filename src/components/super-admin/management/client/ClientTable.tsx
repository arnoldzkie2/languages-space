/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import { openOperation, closeOperation, viewClient, newOrUpdateClient, deleteWarning, setSelectedClients } from '@/lib/redux/ManageClient/ManageClientSlice';
import { ClientsProps } from '@/lib/redux/ManageClient/Types';
import { useTranslations } from 'next-intl';

interface Props {

    filteredTable: ClientsProps[]

}

const ClientTable: React.FC<Props> = ({ filteredTable }) => {

    const dispatch = useDispatch()

    const { departmentID } = useSelector((state: RootState) => state.globalState)

    const { clientSelectedID, selectedClients, operation } = useSelector((state: RootState) => state.manageClient)

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (client: ClientsProps) => {

        const isSelected = selectedClients.some((selectedClient) => selectedClient.id === client.id);

        if (isSelected) {

            const updatedSelectedClients = selectedClients.filter((selectedClient) => selectedClient.id !== client.id);

            dispatch(setSelectedClients(updatedSelectedClients));

        } else {

            const updatedSelectedClients = [...selectedClients, client];

            dispatch(setSelectedClients(updatedSelectedClients));

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: ClientsProps[];

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

        dispatch(setSelectedClients(updatedSelectedClients));

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

        dispatch(setSelectedClients([]))

    }, [departmentID])

    const t = useTranslations('client')

    const globalT = useTranslations('global')
    
    const operationT = useTranslations('operation')

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-5/6">
            <thead className="text-xs uppercase bg-slate-50 border">
                <tr>
                    <th scope='col' className='pl-6 py-3'>
                        <input type="checkbox"
                            className='cursor-pointer w-4 h-4 outline-none'
                            title='Select all 10 rows'
                            checked={isRowChecked}
                            onChange={selectAllRows}
                        />
                    </th>
                    <th scope="col" className="px-1 py-3">{t('name')}</th>
                    <th scope="col" className="px-1 py-3">{t('phone')}</th>
                    <th scope="col" className="px-1 py-3">{t('organization')}</th>
                    <th scope="col" className="px-1 py-3">{t('origin')}</th>
                    <th scope="col" className="px-1 py-3">{t('note')}</th>
                    <th scope="col" className="px-1 py-3">{globalT('operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(client => (
                        <tr className="bg-white border hover:bg-slate-50" key={client.id}>
                            <td className='pl-6 py-2'>
                                <input type="checkbox" id={client.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(client)}
                                    checked={selectedClients.some(selectedClient => selectedClient.id === client.id)}
                                />
                            </td>
                            <td className="px-1 py-2">
                                <label htmlFor={client.id} className='cursor-pointer'>{client.name}</label>
                            </td>
                            <td className='px-1 py-2'>{client.phone_number ? client.phone_number : 'No Data'}</td>
                            <td className="px-1 py-2">{client.organization ? client.organization : 'No Data'}</td>
                            <td className="px-1 py-2">{client.origin ? client.origin : 'No Data'}</td>
                            <td className="px-1 py-2">{client.note ? client.note : 'No Data'}</td>
                            <td className='py-2 relative pl-7'>
                                <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer text-2xl text-black' onClick={() => dispatch(openOperation(client.id))} />
                                <ul className={`${operation && clientSelectedID === client.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' onClick={() => dispatch(viewClient(client))}>{operationT('view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600' onClick={() => dispatch(newOrUpdateClient({ type: 'update', client }))}>{operationT('update')} <FontAwesomeIcon icon={faPenToSquare} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => dispatch(deleteWarning(client))}>{operationT('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => dispatch(closeOperation())}>{operationT('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    <tr className="bg-white border hover:bg-slate-50">
                        <td className='pl-6 py-2 '>This</td>
                        <td className='px-1 py-2 '>Department</td>
                        <td className='px-1 py-2 '>Has</td>
                        <td className='px-1 py-2 '>No</td>
                        <td className='px-1 py-2 '>Data</td>
                        <td className='px-1 py-2 '>...</td>
                    </tr>
                }
            </tbody>
        </table>
    );
};

export default ClientTable;
