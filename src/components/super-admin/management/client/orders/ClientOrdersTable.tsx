/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/lib/types/super-admin/orderType';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Checkbox } from '@/components/ui/checkbox';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import ViewOrderAlert from '../../order/ViewOrderAlert';
import DeleteSingleClientOrderAlert from './DeleteSingleClientOrderAlert';
import DeleteSelectedClientOrdersAlert from './DeleteSelectedClientOrdersAlert';
import useClientOrderStore from '@/lib/state/super-admin/ClientOrdersStore';

interface Props {
    filteredTable: Order[]
    clientID: string
}

const ClientOrderTable: React.FC<Props> = ({ filteredTable, clientID }) => {

    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { selectedClientOrders, setSelectedClientOrders } = useClientOrderStore()
    const { operation, openOperation, closeOperation, selectedID, returnTruncateText, openTruncateTextModal } = useGlobalStore()
    const departmentID = useDepartmentStore(s => s.departmentID)
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const handleSelection = (client: Order) => {

        const isSelected = selectedClientOrders.some((selectedClient) => selectedClient.id === client.id);

        if (isSelected) {

            const updatedselectedOrder = selectedClientOrders.filter((selectedClient) => selectedClient.id !== client.id);
            setSelectedClientOrders(updatedselectedOrder);

        } else {

            const updatedselectedOrder = [...selectedClientOrders, client];
            setSelectedClientOrders(updatedselectedOrder);
        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;
        let updatedselectedOrder: Order[];

        const isSelected = filteredTable.every((client) =>
            selectedClientOrders.some((selectedClient) => selectedClient.id === client.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedselectedOrder = selectedClientOrders.filter((selectedClient) =>
                filteredTable.every((client) => client.id !== selectedClient.id))

        } else {
            // Select all rows on the current page and keep existing selections
            updatedselectedOrder = [
                ...selectedClientOrders,
                ...filteredTable.filter
                    ((client) => !selectedClientOrders.some((selectedClient) => selectedClient.id === client.id)
                    ),
            ];
        }
        setSelectedClientOrders(updatedselectedOrder);
    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((client) => client.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedClientOrders.some((client) => client.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedClientOrders, filteredTable]);

    useEffect(() => {
        setSelectedClientOrders([])
    }, [departmentID])

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')

    return (
        <div className='flex flex-col w-full'>
            <table className="text-sm text-left text-muted-foreground shadow-md w-full">
                <thead className="text-xs uppercase bg-card border">
                    <tr>
                        <th scope='col' className='px-4 py-3'>
                            <Checkbox
                                className='cursor-pointer w-4 h-4 outline-none'
                                title='Select all 10 rows'
                                checked={isRowChecked}
                                onCheckedChange={selectAllRows}
                            />
                        </th>
                        <th scope="col" className="px-4 py-3">{tt('name')}</th>
                        <th scope="col" className="px-4 py-3">{t('order.client_name')}</th>
                        <th scope="col" className="px-4 py-3">{t('order.quantity')}</th>
                        <th scope="col" className="px-4 py-3">{tt('price')}</th>
                        <th scope="col" className="px-4 py-3">{tt('status')}</th>
                        <th scope="col" className="px-4 py-3">{t('order.invoice_number')}</th>
                        <th scope="col" className="px-4 py-3">{t('order.express_number')}</th>
                        <th scope="col" className="px-4 py-3">{tt('note')}</th>
                        <th scope="col" className="px-4 py-3">{tt('date')}</th>
                        <th scope="col" className="px-4 py-3">{t('global.operation')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(order => (
                            <tr className="bg-card border hover:bg-muted" key={order.id}>
                                <td className='px-4 py-3'>
                                    <Checkbox id={order.id}
                                        className='cursor-pointer w-4 h-4 outline-none'
                                        onCheckedChange={() => handleSelection(order)}
                                        checked={selectedClientOrders.some(selectedClientOrders => selectedClientOrders.id === order.id)}
                                    />
                                </td>
                                <td className='px-4 py-3'>
                                    <div className='h-5 w-28 cursor-pointer' onClick={() => openTruncateTextModal(order.name)}>
                                        {returnTruncateText(order.name, 10)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-32 cursor-pointer' onClick={() => openTruncateTextModal(order.client.username)}>
                                        {returnTruncateText(order.client.username, 10)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-10'>
                                        {order.quantity}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-24'>
                                        ¥{order.price}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-24'>
                                        {order.status}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-32'>
                                        {order.invoice_number || 'No Data'}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-32'>
                                        {order.express_number || 'No Data'}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {order.note && <div className='h-5 w-32 cursor-pointer' onClick={() => openTruncateTextModal(order.note || '')}>
                                        {returnTruncateText(order.note, 15)}
                                    </div>}
                                </td>
                                <td className="px-4 py-3">
                                    <div className='h-5 w-44'>
                                        {new Date(order.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className='py-3 relative px-4'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(order.id)} />
                                    <ul className={`${operation && selectedID === order.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-muted-foreground`}>
                                        <ViewOrderAlert orderID={order.id} />
                                        {isAdminAllowed('update_orders') && <Link href={`/admin/manage/orders/update/${order.id}`} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></Link>}
                                        {isAdminAllowed('delete_orders') && <DeleteSingleClientOrderAlert order={order} clientID={clientID} />}
                                        <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                    </ul>
                                </td>
                            </tr>
                        )) :
                        skeleton.map(item => (
                            <tr key={item} className='border bg-card'>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-md w-5 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-32 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-20 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-28 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-44 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-4'>
                                    <Skeleton className='rounded-3xl w-10 h-5'></Skeleton>
                                </td>
                            </tr>
                        ))
                    }
                </tbody >
                <TruncateTextModal />
            </table >
            <DeleteSelectedClientOrdersAlert clientID={clientID} />
        </div>

    );
};

export default ClientOrderTable;
