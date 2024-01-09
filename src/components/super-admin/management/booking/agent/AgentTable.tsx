/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard, faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore';
import { Agent } from '@/lib/types/super-admin/agentType';
import useGlobalStore from '@/lib/state/globalStore';

interface Props {

    filteredTable: Agent[]

}

const AgentTable: React.FC<Props> = ({ filteredTable }) => {

    const { selectedAgents, setSelectedAgents } = useAdminAgentStore()
    const { operation, openOperation, closeOperation, selectedID, departmentID, skeleton } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (agent: Agent) => {

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

        let updatedSelectedClients: Agent[]

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
                    filteredTable.map(agent => (
                        <tr className="bg-white border hover:bg-slate-50" key={agent.id}>
                            <td className='px-6 py-3'>
                                <input type="checkbox" id={agent.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(agent)}
                                    checked={selectedAgents.some(selectedAgent => selectedAgent.id === agent.id)}
                                />
                            </td>
                            <td className="px-6 py-3">
                                <label htmlFor={agent.id} className='cursor-pointer h-5 w-36'>{agent.name}</label>
                            </td>
                            <td className="px-6 py-3">
                                <label htmlFor={agent.id} className='cursor-pointer h-5 w-36'>{agent.username}</label>
                            </td>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-32'>
                                    {agent.phone_number}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {agent.organization}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {agent.origin}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {agent.note}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(agent.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(agent.id)} />
                                <ul className={`${operation && selectedID === agent.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    {/* <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' onClick={() => viewClient(agent)}>{tt('view')} <FontAwesomeIcon icon={faEye} /></li> */}
                                    <Link href={`/manage/agent/update/${agent.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    {/* <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => deleteWarning(agent)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li> */}
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

export default AgentTable;
