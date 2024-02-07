/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { Supplier } from '@/lib/types/super-admin/supplierTypes';
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import SupplierCommissionModal from './SupplierCommissionModal';
import DeleteSingleSupplierAlert from './DeleteSingleSupplierAlert';
import DeleteSelectedSupplierAlert from './DeleteSelectedSupplierAlert';
import ViewSupplierAlert from './ViewSupplierAlert';

interface Props {
    filteredTable: Supplier[]
}

const SupplierTable: React.FC<Props> = ({ filteredTable }) => {

    const { selectedSupplier, setSelectedSupplier, openViewSupplierModal, deleteSupplierWarning } = useAdminSupplierStore()
    const { openOperation, closeOperation, operation, selectedID, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const departmentID = useDepartmentStore(s => s.departmentID)
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const handleSelection = (supplier: Supplier) => {
        const isSelected = selectedSupplier.some((selectedSupplier) => selectedSupplier.id === supplier.id);

        if (isSelected) {
            const updatedSelectedSupplier = selectedSupplier.filter((selectedSupplier) => selectedSupplier.id !== supplier.id);
            setSelectedSupplier(updatedSelectedSupplier)

        } else {
            const updatedSelectedSupplier = [...selectedSupplier, supplier];
            setSelectedSupplier(updatedSelectedSupplier)

        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedSupplier: Supplier[];

        const isSelected = filteredTable.every((suplier) =>
            selectedSupplier.some((selectedSupplier) => selectedSupplier.id === suplier.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedSupplier = selectedSupplier.filter((selectedSupplier) =>
                filteredTable.every((supplier) => supplier.id !== selectedSupplier.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedSupplier = [
                ...selectedSupplier,
                ...filteredTable.filter(
                    (supplier) => !selectedSupplier.some((selectedSupplier) => selectedSupplier.id === supplier.id)
                ),
            ];
        }
        setSelectedSupplier(updatedSelectedSupplier);
    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((client) => client.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedSupplier.some((client) => client.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedSupplier, filteredTable]);

    useEffect(() => {
        setSelectedSupplier([])
    }, [departmentID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='flex w-full flex-col'>
            <table className="text-sm text-left shadow-md w-full text-muted-foreground">
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
                        <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable.length < 1 ? <TableSkeleton /> : filteredTable.map(supplier => (
                        <tr className="bg-card border hover:bg-muted hover:text-foreground" key={supplier.id}>
                            <td className='px-6 py-3'>
                                <Checkbox id={supplier.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onCheckedChange={() => handleSelection(supplier)}
                                    checked={selectedSupplier.some(selectedSupplier => selectedSupplier.id === supplier.id)}
                                />
                            </td>
                            <td className="px-6 py-3">
                                <label htmlFor={supplier.id}
                                    className='cursor-pointer h-5 w-36'
                                    onClick={() => openTruncateTextModal(supplier.username)}
                                >{returnTruncateText(supplier.username, 20)}</label>
                            </td>
                            <td className="px-6 py-3">
                                {supplier.name && <div
                                    className='cursor-pointer h-5 w-36'
                                    onClick={() => openTruncateTextModal(supplier.name)}
                                >{returnTruncateText(supplier.name, 20)}</div>}
                            </td>
                            <td className="px-6 py-3">
                                {supplier.phone_number && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(supplier.phone_number || '')}>
                                    {returnTruncateText(supplier.phone_number, 18)}
                                </div>}
                            </td>
                            <td className="px-6 py-3">
                                {supplier.organization && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(supplier.organization || '')}>
                                    {returnTruncateText(supplier.organization, 15)}
                                </div>}
                            </td>
                            <td className="px-6 py-3">
                                {supplier.origin && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(supplier.origin || '')}>
                                    {returnTruncateText(supplier.origin, 15)}
                                </div>}
                            </td>
                            <td className="px-6 py-3">
                                {supplier.note && <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(supplier.note || '')}>
                                    {returnTruncateText(supplier.note, 15)}
                                </div>}
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(supplier.id)} />
                                <ul className={`${operation && selectedID === supplier.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-36 shadow-lg border flex flex-col text-muted-foreground`}>
                                    <ViewSupplierAlert supplierID={supplier.id} />
                                    {isAdminAllowed('update_supplier') && <SupplierCommissionModal supplierName={supplier.name} supplierID={supplier.id} />}
                                    {isAdminAllowed('update_supplier') && <Link href={`/admin/manage/supplier/update/${supplier.id}`} className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                    {isAdminAllowed('delete_supplier') && <DeleteSingleSupplierAlert supplier={supplier} />}
                                    <li className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody >
                <TruncateTextModal />
            </table >
            <DeleteSelectedSupplierAlert />
        </div>
    );
};

const TableSkeleton = () => {

    const { skeleton } = useGlobalStore()

    return (
        <>
            {skeleton.map(item => (
                <tr key={item} className='border bg-card'>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-md w-5 h-5'></Skeleton>
                    </td>
                    <td className='py-3.5 px-6'>
                        <Skeleton className='rounded-3xl w-36 h-5'></Skeleton>
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
                        <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                    </td>
                </tr>
            ))
            }
        </>
    )
}

export default SupplierTable;
