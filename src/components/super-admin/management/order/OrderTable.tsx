/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import {  faPenToSquare, faTrashCan, faEye } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import Link from 'next-intl/link'
import useAdminOrderStore from '@/lib/state/super-admin/orderStore';
import { Order } from '@/lib/types/super-admin/orderType';

interface Props {
    filteredTable: Order[]
}

const OrderTable: React.FC<Props> = ({ filteredTable }) => {

    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const { departmentID } = useAdminGlobalStore()
    const { selectedOrder, setSelectedOrder, openViewOrder } = useAdminOrderStore()
    const { operation, openOperation, closeOperation, selectedID } = useAdminGlobalStore()

    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);

    const handleSelection = (client: Order) => {

        const isSelected = selectedOrder.some((selectedClient) => selectedClient.id === client.id);

        if (isSelected) {

            const updatedselectedOrder = selectedOrder.filter((selectedClient) => selectedClient.id !== client.id);
            setSelectedOrder(updatedselectedOrder);

        } else {

            const updatedselectedOrder = [...selectedOrder, client];
            setSelectedOrder(updatedselectedOrder);
        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;
        let updatedselectedOrder: Order[];

        const isSelected = filteredTable.every((client) =>
            selectedOrder.some((selectedClient) => selectedClient.id === client.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedselectedOrder = selectedOrder.filter((selectedClient) =>
                filteredTable.every((client) => client.id !== selectedClient.id))

        } else {
            // Select all rows on the current page and keep existing selections
            updatedselectedOrder = [
                ...selectedOrder,
                ...filteredTable.filter(
                    (client) => !selectedOrder.some((selectedClient) => selectedClient.id === client.id)
                ),
            ];
        }
        setSelectedOrder(updatedselectedOrder);
    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((client) => client.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedOrder.some((client) => client.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedOrder, filteredTable]);

    useEffect(() => {
        setSelectedOrder([])
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
                    <th scope="col" className="px-5 py-3">{t('order.card')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.client_name')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.quantity')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.price')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.status')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.invoice_number')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.express_number')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.note')}</th>
                    <th scope="col" className="px-5 py-3">{t('order.date')}</th>
                    <th scope="col" className="px-5 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(order => (
                        <tr className="bg-white border hover:bg-slate-50" key={order.id}>
                            <td className='px-5 py-3'>
                                <input type="checkbox" id={order.id}
                                    className='cursor-pointer w-4 h-4 outline-none'
                                    onChange={() => handleSelection(order)}
                                    checked={selectedOrder.some(selectedorder => selectedorder.id === order.id)}
                                />
                            </td>
                            <td className='px-5 py-3'>
                                <div className='h-5 w-28'>
                                    {order.card.name}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-32'>
                                    {order.client.name}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-10'>
                                    {order.quantity}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-24'>
                                    ¥{order.price}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-24'>
                                    {order.status}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-32'>
                                    {order.invoice_number || 'No Data'}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-32'>
                                    {order.express_number || 'No Data'}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-32'>
                                    {order.note || 'No Data'}
                                </div>
                            </td>
                            <td className="px-5 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(order.date).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-5'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(order.id)} />
                                <ul className={`${operation && selectedID === order.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' onClick={() => openViewOrder(order)}>{tt('view')} <FontAwesomeIcon icon={faEye} /></li>
                                    <Link href={`/manage/orders/update/${order.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600'>{tt('delete')} <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-md animate-pulse w-5 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-32 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-24 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-20 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-28 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-44 h-5'></div>
                            </td>
                            <td className='py-3.5 px-5'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-10 h-5'></div>
                            </td>
                        </tr>
                    ))
                }
            </tbody >
        </table >
    );
};

export default OrderTable;
