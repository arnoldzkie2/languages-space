/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faNewspaper, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard, faEye, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminClientStore, { ClientProps } from '@/lib/state/super-admin/clientStore';
import Link from 'next/link'
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import DeleteSingleClientAlert from './DeleteSingleClientAlert';
import DeleteSelectedClientAlert from './DeleteSelectedClientAlert';
import ViewClientAlert from './ViewClientAlert';

interface Props {

    filteredTable: ClientProps[]

}

const ClientTable: React.FC<Props> = ({ filteredTable }) => {

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const { selectedClients, setSelectedClients, viewClient } = useAdminClientStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton, openTruncateTextModal, returnTruncateText } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const departmentID = useDepartmentStore(s => s.departmentID)
    const handleSelection = (client: ClientProps) => {

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

        let updatedSelectedClients: ClientProps[];

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
    const tt = useTranslations('global')

    return (
        <div className='flex flex-col w-full'>
            <table className="text-sm text-left shadow-md w-full text-muted-foreground">
                <thead className="text-xs uppercase bg-card border">
                    <tr>
                        <th scope='col' className='px-6 py-3'>
                            <Checkbox
                                onCheckedChange={selectAllRows}
                                checked={isRowChecked}
                            />
                        </th>
                        <th scope="col" className="px-6 py-3">{tt('name')}</th>
                        <th scope="col" className="px-6 py-3">{tt('username')}</th>
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
                        filteredTable.map(client => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={client.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox
                                        onCheckedChange={() => handleSelection(client)}
                                        checked={selectedClients.some(selectedClient => selectedClient.id === client.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    <label htmlFor={client.id} className='cursor-pointer h-5 w-36'>{client.name}</label>
                                </td>
                                <td className="px-6 py-3">
                                    <label
                                        className='cursor-pointer h-5 w-28'
                                        onClick={() => openTruncateTextModal(client.username)}
                                    >{returnTruncateText(client.username, 20)}</label>
                                </td>
                                <td className="px-6 py-3">
                                    {client.phone_number && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(client.phone_number || '')}>
                                        {returnTruncateText(client.phone_number, 18)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {client.organization && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(client.organization || '')}>
                                        {returnTruncateText(client.organization, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {client.origin && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(client.origin || '')}>
                                        {returnTruncateText(client.origin, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {client.note && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(client.note || '')}>
                                        {returnTruncateText(client.note, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-44'>
                                        {new Date(client.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className='py-3 relative px-6'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(client.id)} />
                                    <ul className={`${operation && selectedID === client.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-28 shadow-lg border flex flex-col text-muted-foreground`}>
                                        <ViewClientAlert clientID={client.id} />
                                        {isAdminAllowed('view_orders') && client.orders && <Link href={`/admin/manage/client/orders/${client.id}`} className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer'>{t('side-nav.orders')} <FontAwesomeIcon icon={faNewspaper} /></Link>}
                                        {isAdminAllowed('view_client_cards') && client.cards && <Link href={`/admin/manage/client/card/${client.id}`} className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer'>{t('client.card.client')} <FontAwesomeIcon icon={faCreditCard} /></Link>}
                                        {isAdminAllowed('update_client') && <Link href={`/admin/manage/client/update/${client.id}`} className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                        {isAdminAllowed('delete_client') && <DeleteSingleClientAlert client={client} />}
                                        <li className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                    </ul>
                                </td>
                            </tr>
                        )) :
                        skeleton.map(item => (
                            <tr key={item} className='bg-card border'>
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
            <DeleteSelectedClientAlert />
        </div>
    );
};

export default ClientTable;
