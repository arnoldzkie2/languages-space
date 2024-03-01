/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { AgentDeductions } from '@prisma/client';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useAgentDeductionStore from '@/lib/state/super-admin/AgentDeductionStore';
import DeleteDeductionAlert from './DeleteDeductionAlert';
import DeleteSelectedDeductionsAlert from './DeleteSelectedDeductionsALert';

interface Props {
    filteredTable: AgentDeductions[]
    agentID: string
}

const AgentDeductionTable: React.FC<Props> = ({ filteredTable, agentID }) => {

    const { selectedDeductions, setSelectedDeductions } = useAgentDeductionStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const departmentID = useDepartmentStore(s => s.departmentID)
    const handleSelection = (agent: AgentDeductions) => {

        const isSelected = selectedDeductions.some((selectedAgent) => selectedAgent.id === agent.id);

        if (isSelected) {

            const updatedSelectedClients = selectedDeductions.filter((selectedAgent) => selectedAgent.id !== agent.id);
            setSelectedDeductions(updatedSelectedClients);

        } else {

            const updatedSelectedClients = [...selectedDeductions, agent];
            setSelectedDeductions(updatedSelectedClients);

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: AgentDeductions[]

        const isSelected = filteredTable.every((agent) =>
            selectedDeductions.some((selectedAgent) => selectedAgent.id === agent.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedClients = selectedDeductions.filter((selectedAgent) =>
                filteredTable.every((agent) => agent.id !== selectedAgent.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedClients = [
                ...selectedDeductions,
                ...filteredTable.filter(
                    (agent) => !selectedDeductions.some((selectedAgent) => selectedAgent.id === agent.id)
                ),
            ];
        }
        setSelectedDeductions(updatedSelectedClients);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((agent) => agent.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedDeductions.some((agent) => agent.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedDeductions, filteredTable]);

    useEffect(() => {

        setSelectedDeductions([])

    }, [departmentID])

    const t = useTranslations('')

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
                        <th scope="col" className="px-6 py-3">{t('info.name')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.amount')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.rate')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.quantity')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.date')}</th>
                        <th scope="col" className="px-6 py-3">{t('operation.h1')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(deduction => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={deduction.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox id={deduction.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(deduction)}
                                        checked={selectedDeductions.some(selectedAgent => selectedAgent.id === deduction.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    <label htmlFor={deduction.id} className='cursor-pointer h-5 w-28'>{deduction.name}</label>
                                </td>
                                <td className='px-6 py-3'>
                                    <div className='h-5 w-28'>
                                        {Number(deduction.amount)}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-28'>
                                        {Number(deduction.rate)}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-28'>
                                        {deduction.quantity}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-44'>
                                        {new Date(deduction.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className='py-3 relative px-6'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(deduction.id)} />
                                    <ul className={`${operation && selectedID === deduction.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-32 shadow-lg border flex flex-col text-muted-foreground`}>
                                        {isAdminAllowed('delete_agent_deductions') && <DeleteDeductionAlert deduction={deduction}
                                            agentID={agentID}
                                        />}
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
            <DeleteSelectedDeductionsAlert agentID={agentID} />
        </div>
    );
};

export default AgentDeductionTable;
