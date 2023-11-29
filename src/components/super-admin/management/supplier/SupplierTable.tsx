/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { Supplier } from '@/lib/types/super-admin/supplierTypes';

interface Props {

    filteredTable: Supplier[]

}

const SupplierTable: React.FC<Props> = ({ filteredTable }) => {

    const { departmentID } = useAdminGlobalStore()
    const { selectedSupplier, setSelectedSupplier, openViewSupplierModal, deleteSupplierWarning } = useAdminSupplierStore()
    const { openOperation, closeOperation, operation, selectedID } = useAdminGlobalStore()

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

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
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(supplier => (
                        <tr className="bg-white border hover:bg-slate-50" key={supplier.id}>
                            <td className='px-6 py-3'>
                                <input type="checkbox" id={supplier.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(supplier)}
                                    checked={selectedSupplier.some(selectedSupplier => selectedSupplier.id === supplier.id)}
                                />
                            </td>
                            <td className="px-6 py-3">
                                <label htmlFor={supplier.id} className='cursor-pointer h-5 w-36'>{supplier.name}</label>
                            </td>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-32'>

                                    {supplier.phone_number ? supplier.phone_number : 'No Data'}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>

                                    {supplier.organization ? supplier.organization : 'No Data'}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {supplier.origin ? supplier.origin : 'No Data'}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-28'>
                                    {supplier.note ? supplier.note : 'No Data'}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(supplier.id)} />
                                <ul className={`${operation && selectedID === supplier.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' onClick={() => openViewSupplierModal(supplier)}>{tt('view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/supplier/update/${supplier.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => deleteSupplierWarning(supplier)}>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
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
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default SupplierTable;
