/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useAdminAgentStore, { AgentProps } from '@/lib/state/super-admin/agentStore';
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import DeleteSingleAgentAlert from './DeleteSingleAgentALert';
import DeleteSelectedAgentAlert from './DeleteSelectedAgentAlert';
import ViewAgentAlert from './ViewAgentAlert';

interface Props {
    filteredTable: AgentProps[]
}

const AgentTable: React.FC<Props> = ({ filteredTable }) => {

    const { selectedAgents, setSelectedAgents } = useAdminAgentStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const departmentID = useDepartmentStore(s => s.departmentID)
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const handleSelection = (agent: AgentProps) => {

        const isSelected = selectedAgents.some((selectedAgent) => selectedAgent.id === agent.id);

        if (isSelected) {

            const updatedSelectedClients = selectedAgents.filter((selectedAgent) => selectedAgent.id !== agent.id);
            setSelectedAgents(updatedSelectedClients);

        } else {

            const updatedSelectedClients = [...selectedAgents, agent];
            setSelectedAgents(updatedSelectedClients);

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: AgentProps[]

        const isSelected = filteredTable.every((agent) =>
            selectedAgents.some((selectedAgent) => selectedAgent.id === agent.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedClients = selectedAgents.filter((selectedAgent) =>
                filteredTable.every((agent) => agent.id !== selectedAgent.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedClients = [
                ...selectedAgents,
                ...filteredTable.filter(
                    (agent) => !selectedAgents.some((selectedAgent) => selectedAgent.id === agent.id)
                ),
            ];
        }

        setSelectedAgents(updatedSelectedClients);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((agent) => agent.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedAgents.some((agent) => agent.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedAgents, filteredTable]);

    useEffect(() => {

        setSelectedAgents([])

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
                        filteredTable.map(agent => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={agent.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox id={agent.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(agent)}
                                        checked={selectedAgents.some(selectedAgent => selectedAgent.id === agent.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    <label htmlFor={agent.id} className='cursor-pointer h-5 w-36'>{agent.name}</label>
                                </td>
                                <td className='px-6 py-3'>
                                    {agent.phone_number && <div className='h-5 cursor-pointer w-32' onClick={() => openTruncateTextModal(agent.phone_number || '')}>
                                        {agent.phone_number}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {agent.organization && <div className='h-5 cursor-pointer w-28' onClick={() => openTruncateTextModal(agent.organization || '')}>
                                        {agent.organization}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {agent.origin && <div className='h-5 cursor-pointer w-28' onClick={() => openTruncateTextModal(agent.origin || '')}>
                                        {agent.origin}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {agent.note && <div className='h-5 cursor-pointer w-28' onClick={() => openTruncateTextModal(agent.note || '')}>
                                        {returnTruncateText(agent.note, 15)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-44'>
                                        {new Date(agent.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className='py-3 relative px-6'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(agent.id)} />
                                    <ul className={`${operation && selectedID === agent.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-32 shadow-lg border flex flex-col text-muted-foreground`}>

                                        {agent.invites && <Link href={`/admin/manage/agent/invites/${agent.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('invites')}</Link>}

                                        {isAdminAllowed('view_agent_deductions') && agent.deductions && <Link href={`/admin/manage/agent/deductions/${agent.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('deductions')}</Link>}

                                        {isAdminAllowed('view_agent_earnings') && agent.earnings && <Link href={`/admin/manage/agent/earnings/${agent.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('earnings')}</Link>}

                                        <ViewAgentAlert agentID={agent.id} />

                                        {isAdminAllowed('update_agent') && <Link href={`/admin/manage/agent/update/${agent.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}

                                        {isAdminAllowed('delete_agent') && <DeleteSingleAgentAlert agent={agent} />}

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

export default AgentTable;
