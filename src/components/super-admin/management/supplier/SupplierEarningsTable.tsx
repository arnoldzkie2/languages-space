/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import { SupplierEarnings } from '@prisma/client';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import DeleteEarningsAlert from './DeleteEarningsAlert';
import useSupplierEarningsStore from '@/lib/state/super-admin/supplierEarningStore';
import DeleteSelectedEarningsAlert from './DeleteSelectedEarningsAlert';

interface Props {

    filteredTable: SupplierEarnings[]
    supplierID: string
}

const SupplierEarningsTable: React.FC<Props> = ({ filteredTable, supplierID }) => {

    const { selectedEarnings, setSelectedEarnings } = useSupplierEarningsStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const departmentID = useDepartmentStore(s => s.departmentID)
    const handleSelection = (agent: SupplierEarnings) => {

        const isSelected = selectedEarnings.some((selectedAgent) => selectedAgent.id === agent.id);

        if (isSelected) {

            const updatedSelectedClients = selectedEarnings.filter((selectedAgent) => selectedAgent.id !== agent.id);
            setSelectedEarnings(updatedSelectedClients);

        } else {

            const updatedSelectedClients = [...selectedEarnings, agent];
            setSelectedEarnings(updatedSelectedClients);

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: SupplierEarnings[]

        const isSelected = filteredTable.every((agent) =>
            selectedEarnings.some((selectedAgent) => selectedAgent.id === agent.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedClients = selectedEarnings.filter((selectedAgent) =>
                filteredTable.every((agent) => agent.id !== selectedAgent.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedClients = [
                ...selectedEarnings,
                ...filteredTable.filter(
                    (agent) => !selectedEarnings.some((selectedAgent) => selectedAgent.id === agent.id)
                ),
            ];
        }
        setSelectedEarnings(updatedSelectedClients);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((agent) => agent.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedEarnings.some((agent) => agent.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedEarnings, filteredTable]);

    useEffect(() => {

        setSelectedEarnings([])

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
                        <th scope="col" className="px-6 py-3">{tt('amount')}</th>
                        <th scope="col" className="px-6 py-3">{tt('rate')}</th>
                        <th scope="col" className="px-6 py-3">{tt('quantity')}</th>
                        <th scope="col" className="px-6 py-3">{tt('date')}</th>
                        <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(earnings => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={earnings.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox id={earnings.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(earnings)}
                                        checked={selectedEarnings.some(selectedAgent => selectedAgent.id === earnings.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    <label htmlFor={earnings.id} className='cursor-pointer h-5 w-28'>{earnings.name}</label>
                                </td>
                                <td className='px-6 py-3'>
                                    <div className='h-5 w-28'>
                                        {Number(earnings.amount)}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-28'>
                                        {Number(earnings.rate)}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-28'>
                                        {earnings.quantity}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-44'>
                                        {new Date(earnings.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className='py-3 relative px-6'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(earnings.id)} />
                                    <ul className={`${operation && selectedID === earnings.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-32 shadow-lg border flex flex-col text-muted-foreground`}>
                                        {isAdminAllowed('delete_supplier_earnings') && <DeleteEarningsAlert earnings={earnings}
                                            supplierID={supplierID}
                                        />}
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
            <DeleteSelectedEarningsAlert supplierID={supplierID} />
        </div>
    );
};

export default SupplierEarningsTable;
