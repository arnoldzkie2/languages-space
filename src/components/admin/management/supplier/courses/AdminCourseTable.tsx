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
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

interface Props {

    filteredTable: Courses[]

}

const AdminCourseTable: React.FC<Props> = ({ filteredTable }) => {

    const [skeleton, setSkeleton] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const { operation, selectedID, openOperation, closeOperation, isLoading, setIsLoading } = useGlobalStore()
    const permissions = useAdminPageStore(s => s.permissions)

    const { getCourses, openSelectedCourse } = useAdminSupplierStore()

    const deleteCourse = async (e: any, courseID: string) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const { data } = await axios.delete('/api/courses', {
                params: { courseID }
            })

            if (data.ok) {
                setIsLoading(false)
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
        <table className="text-sm text-left text-gray-800 shadow-md w-full">
            <thead className="text-xs uppercase bg-slate-100 border">
                <tr>
                    <th scope="col" className="px-6 py-3">{tt('name')}</th>
                    <th scope="col" className="px-6 py-3">{tt('date')}</th>
                    <th scope="col" className="px-6 py-3">{t('global.operation')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredTable && filteredTable.length > 0 ?
                    filteredTable.map(course => (
                        <tr className="bg-white border hover:bg-slate-50" key={course.id}>
                            <td className='px-6 py-3'>
                                <div className='h-5 w-40'>
                                    {course.name}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className='h-5 w-44'>
                                    {new Date(course.created_at).toLocaleString()}
                                </div>
                            </td>
                            <td className='py-3 relative px-6'>
                                <FontAwesomeIcon icon={faEllipsis} className='h-5 w-10 cursor-pointer text-black' onClick={() => openOperation(course.id)} />
                                <ul className={`${operation && selectedID === course.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-1 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    {permissions?.update_courses && <li onClick={() => openSelectedCourse(course)} className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>{tt('update')}
                                        <FontAwesomeIcon icon={faPenToSquare} width={16} height={16} />
                                    </li>}
                                    {permissions?.delete_courses && <button disabled={isLoading} className='flex mb-1 w-full items-center cursor-pointer hover:text-red-600' onClick={(e: any) => deleteCourse(e, course.id)}>
                                        {isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : <div className='flex items-center w-full justify-between'>
                                            {tt('delete')} <FontAwesomeIcon icon={faTrashCan} />
                                        </div>}
                                    </button>}
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={() => closeOperation()}>{tt('close')} <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    skeleton.map(item => (
                        <tr key={item}>
                            <td className='py-3.5 px-6'>
                                <div className='bg-slate-200 rounded-3xl animate-pulse w-40 h-5'></div>
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

export default AdminCourseTable;
