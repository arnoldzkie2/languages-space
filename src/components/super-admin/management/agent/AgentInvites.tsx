/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import DeleteSelectedAgentAlert from './DeleteSelectedAgentAlert';
import { ClientProps } from '@/lib/state/super-admin/clientStore';
import useAgentInviteStore from '@/lib/state/super-admin/AgentInviteStore';

interface Props {
    filteredTable: ClientProps[]
}

const AgentInvitesTable: React.FC<Props> = ({ filteredTable }) => {

    const { selectedInvites, setSelectedInvites } = useAgentInviteStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const departmentID = useDepartmentStore(s => s.departmentID)
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const handleSelection = (client: ClientProps) => {

        const isSelected = selectedInvites.some((selectedAgent) => selectedAgent.id === client.id);

        if (isSelected) {

            const updatedSelectedClients = selectedInvites.filter((selectedAgent) => selectedAgent.id !== client.id);
            setSelectedInvites(updatedSelectedClients);

        } else {

            const updatedSelectedClients = [...selectedInvites, client];
            setSelectedInvites(updatedSelectedClients);

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: ClientProps[]

        const isSelected = filteredTable.every((client) =>
            selectedInvites.some((selectedAgent) => selectedAgent.id === client.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedClients = selectedInvites.filter((selectedAgent) =>
                filteredTable.every((client) => client.id !== selectedAgent.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedClients = [
                ...selectedInvites,
                ...filteredTable.filter(
                    (client) => !selectedInvites.some((selectedAgent) => selectedAgent.id === client.id)
                ),
            ];
        }

        setSelectedInvites(updatedSelectedClients);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((client) => client.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedInvites.some((client) => client.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedInvites, filteredTable]);

    useEffect(() => {

        setSelectedInvites([])

    }, [departmentID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='flex w-full flex-col'>
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
                        <th scope="col" className="px-6 py-3">{tt('username')}</th>
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
                        filteredTable.map(client => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={client.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox id={client.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(client)}
                                        checked={selectedInvites.some(selectedAgent => selectedAgent.id === client.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    <label htmlFor={client.id} className='cursor-pointer h-5 w-36'>{client.username}</label>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='cursor-pointer h-5 w-36'>{client.name}</div>
                                </td>
                                <td className='px-6 py-3'>
                                    <div className='h-5 w-32'>
                                        {client.phone_number}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-28'>
                                        {client.organization}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-28'>
                                        {client.origin}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    {client.note && <div className='h-5 w-28' onClick={() => openTruncateTextModal(client.note || '')}>
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
                                    <ul className={`${operation && selectedID === client.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-32 shadow-lg border flex flex-col text-muted-foreground`}>
                                        {isAdminAllowed('view_client_cards') && client.cards && <Link href={`/admin/manage/client/card/${client.id}`} className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer'>{t('client.card.client')} <FontAwesomeIcon icon={faCreditCard} /></Link>}
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
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
                                    <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
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
            </table >
            <DeleteSelectedAgentAlert />
        </div>
    );
};

export default AgentInvitesTable;
