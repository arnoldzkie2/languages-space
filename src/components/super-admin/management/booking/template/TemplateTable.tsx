/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import useGlobalStore from '@/lib/state/globalStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { BookingCommentTemplates } from '@prisma/client';
import useCommentTemplateStore from '@/lib/state/super-admin/commentTemplateStore';
import UpdateTemplate from './UpdateTemplate';
import DeleteTemplate from './DeleteTemplate';
import DeleteSelectedTemplates from './DeleteSelectedTemplate';

interface Props {
    filteredTable: BookingCommentTemplates[]
}

const TemplateTable: React.FC<Props> = ({ filteredTable }) => {

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const { selectedTemplates, setSelectedTemplates } = useCommentTemplateStore()
    const { operation, openOperation, closeOperation, selectedID, skeleton, openTruncateTextModal, returnTruncateText } = useGlobalStore()
    const [isRowChecked, setIsRowChecked] = useState<boolean>(false);
    const handleSelection = (client: BookingCommentTemplates) => {

        const isSelected = selectedTemplates.some((selectedTemplate) => selectedTemplate.id === client.id);

        if (isSelected) {
            const updatedSelectedClients = selectedTemplates.filter((selectedTemplate) => selectedTemplate.id !== client.id);
            setSelectedTemplates(updatedSelectedClients);
        } else {
            const updatedSelectedClients = [...selectedTemplates, client];
            setSelectedTemplates(updatedSelectedClients);
        }
    };

    const selectAllRows = () => {

        if (filteredTable.length === 0) return;

        let updatedSelectedClients: BookingCommentTemplates[];

        const isSelected = filteredTable.every((client) =>
            selectedTemplates.some((selectedTemplate) => selectedTemplate.id === client.id)
        );

        if (isSelected) {
            // Unselect all rows on the current page
            updatedSelectedClients = selectedTemplates.filter((selectedTemplate) =>
                filteredTable.every((client) => client.id !== selectedTemplate.id)
            );
        } else {
            // Select all rows on the current page and keep existing selections
            updatedSelectedClients = [
                ...selectedTemplates,
                ...filteredTable.filter(
                    (client) => !selectedTemplates.some((selectedTemplate) => selectedTemplate.id === client.id)
                ),
            ];
        }

        setSelectedTemplates(updatedSelectedClients);

    };

    useEffect(() => {
        const currentPageIds = filteredTable.map((client) => client.id);
        const areAllClientsSelected =
            currentPageIds.length > 0 &&
            currentPageIds.every((id) =>
                selectedTemplates.some((client) => client.id === id)
            );
        setIsRowChecked(areAllClientsSelected);
    }, [selectedTemplates, filteredTable]);

    const t = useTranslations()

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
                        <th scope="col" className="px-6 py-3">{t('info.gender.h1')}</th>
                        <th scope="col" className="px-6 py-3">{t('user.h1')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.message')}</th>
                        <th scope="col" className="px-6 py-3">{t('info.date.h1')}</th>
                        <th scope="col" className="px-6 py-3">{t('operation.h1')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable && filteredTable.length > 0 ?
                        filteredTable.map(template => (
                            <tr className="bg-card border hover:bg-muted hover:text-foreground" key={template.id}>
                                <td className='px-6 py-3'>
                                    <Checkbox
                                        onCheckedChange={() => handleSelection(template)}
                                        checked={selectedTemplates.some(selectedTemplate => selectedTemplate.id === template.id)}
                                    />
                                </td>
                                <td className="px-6 py-3">
                                    {template.gender && <div className='h-5 w-24 cursor-pointer' onClick={() => openTruncateTextModal(template.gender || '')}>
                                        {returnTruncateText(template.gender, 10)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {template.user && <div className='h-5 w-24 cursor-pointer' onClick={() => openTruncateTextModal(template.user || '')}>
                                        {returnTruncateText(template.user, 10)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    {template.message && <div className='h-5 w-24 cursor-pointer' onClick={() => openTruncateTextModal(template.message || '')}>
                                        {returnTruncateText(template.message, 10)}
                                    </div>}
                                </td>
                                <td className="px-6 py-3">
                                    <div className='h-5 w-27 cursor-pointer' onClick={() => openTruncateTextModal(new Date(template.created_at).toISOString())}>
                                        {returnTruncateText(new Date(template.created_at).toLocaleString(), 10)}
                                    </div>
                                </td>
                                <td className='py-3 relative px-6'>
                                    <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(template.id)} />
                                    <ul className={`${operation && selectedID === template.id ? 'block' : 'hidden'} absolute bg-card p-3 gap-1 z-10 w-28 shadow-lg border flex flex-col text-muted-foreground`}>
                                        {isAdminAllowed('update_booking_comments_template') && <UpdateTemplate templateID={template.id} />}
                                        {isAdminAllowed('delete_booking_comments_template') && <DeleteTemplate template={template} />}
                                        <li className='hover:text-foreground flex mb-1 justify-between items-center cursor-pointer pt-2 border-t' onClick={() => closeOperation()}>{t('operation.close')} <FontAwesomeIcon icon={faXmark} /></li>
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
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
                                </td>
                                <td className='py-3.5 px-6'>
                                    <Skeleton className='rounded-3xl w-24 h-5'></Skeleton>
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
            <DeleteSelectedTemplates />
        </div >
    );
};

export default TemplateTable;
