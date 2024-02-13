/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useTranslations } from 'next-intl';
import { Courses } from '@/lib/types/super-admin/supplierTypes';
import axios from 'axios';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import useGlobalStore from '@/lib/state/globalStore';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import TruncateTextModal from '@/components/global/TruncateTextModal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {

    filteredTable: Courses[]

}

const CoursesTable: React.FC<Props> = ({ filteredTable }) => {

    const { operation, selectedID, openOperation, closeOperation, isLoading, setIsLoading, skeleton, returnTruncateText, openTruncateTextModal } = useGlobalStore()

    const { getCourses, openSelectedCourse } = useAdminSupplierStore()
    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const deleteCourse = async (e: React.MouseEvent, courseID: string) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const { data } = await axios.delete('/api/courses', {
                params: { courseID }
            })

            if (data.ok) {
                setIsLoading(false)
                toast("Success! course has been deleted.")
                getCourses()
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    return (
        <table className="text-sm text-left shadow-md w-full text-muted-foreground">
            <thead className="text-xs uppercase bg-card border">
                <tr>
                    <th scope="col" className="px-6 py-3">{tt('name')}</th>
                    <th scope="col" className="px-6 py-3">{t('courses.supported-cards')}</th>
                    <th scope="col" className="px-6 py-3">{tt('date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(course => (
                        <tr className="bg-card border hover:bg-muted hover:text-muted-foreground" key={course.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-40 cursor-pointer' onClick={() => openTruncateTextModal(course.name)}>
                                    {returnTruncateText(course.name, 20)}
                                </div>
                            </td>
                            <td className='px-6 py-3'>
                                <div className='w-44'>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder={tt('card')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{tt('card')}</SelectLabel>
                                                {course.supported_cards.map(course => (
                                                    <SelectItem key={course.name} value={course.name}>{course.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(course.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer' onClick={() => openOperation(course.id)} />
                                <ul className={`${operation && selectedID === course.id ? 'block' : 'hidden'} absolute bg-card text-muted-foreground p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col`}>
                                    {isAdminAllowed('update_courses') && <li onClick={() => openSelectedCourse(course)} className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground'>{tt('update')} <FontAwesomeIcon icon={faPenToSquare} /></li>}
                                    {isAdminAllowed('delete_courses') && <button disabled={isLoading} className='flex mb-1 w-full items-center cursor-pointer hover:text-foreground' onClick={(e: React.MouseEvent) => deleteCourse(e, course.id)}>
                                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                            {tt('delete')} <FontAwesomeIcon icon={faTrashCan} />
                                        </div>}
                                    </button>}
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-foreground pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item} className='border bg-card'>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-40 h-5'></Skeleton>
                            </td>
                            <td className='py-3.5 px-6'>
                                <Skeleton className='rounded-3xl w-40 h-5'></Skeleton>
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
            <TruncateTextModal />
        </table >
    );
};

export default CoursesTable;
