/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import SideNav from '@/components/super-admin/SideNav';
import Pagination from '@/components/super-admin/management/Pagination';
import CourseHeader from '@/components/super-admin/management/supplier/courses/CoursesHeader';
import CoursesTable from '@/components/super-admin/management/supplier/courses/CoursesTable';
import NewCourseModal from '@/components/super-admin/management/supplier/courses/NewCourseModal';
import SearchCourse from '@/components/super-admin/management/supplier/courses/SearchCourse';
import UpdateCourseModal from '@/components/super-admin/management/supplier/courses/UpdateCourseModal';
import { Link } from '@/lib/navigation';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useGlobalStore from '@/lib/state/globalStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const Page = () => {

    const { currentPage, isSideNavOpen, itemsPerPage } = useGlobalStore();

    const { courses, getCourses, newCourse, updateCourse, totalCourse, setTotalCourse, toggleCreateCourse } = useAdminSupplierStore();

    const permissions = useAdminPageStore(s => s.permissions)

    const [searchQuery, setSearchQuery] = useState('');

    const filterCourses = courses.filter(course => course.name.toUpperCase().includes(searchQuery.toUpperCase()));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentCourses = filterCourses.slice(indexOfFirstItem, indexOfLastItem);

    const getTotalPages = () => Math.ceil(filterCourses.length / itemsPerPage);

    useEffect(() => {
        getCourses();
    }, []);

    useEffect(() => {

        setTotalCourse({
            selected: '',

            searched: filterCourses.length.toString(),

            total: courses.length.toString()
        });

    }, [courses.length, filterCourses.length]);

    const t = useTranslations('super-admin')

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <nav className={`border-b h-20 flex items-center bg-white px-8 justify-between`}>
                    <h1 className='font-black text-gray-600 text-xl uppercase'>{t('courses.h1')}</h1>
                    <ul className='flex items-center h-full ml-auto gap-5'>
                        {permissions?.create_courses && <div onClick={toggleCreateCourse} className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{t('courses.create')}</div>
                        </div>}
                        {permissions?.view_supplier && <Link href='/admin/manage/supplier' className='flex items-center justify-center w-40 text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                            <div>{t('supplier.h1')}</div>
                        </Link>}
                    </ul>
                </nav>
                <div className='flex w-full items-start h-full gap-8 px-8'>
                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6'>
                        <SearchCourse searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>

                    <CoursesTable filteredTable={currentCourses} />

                </div>

                <Pagination getTotalPages={getTotalPages} totals={totalCourse} />
            </div>

            {newCourse && <NewCourseModal />}
            {updateCourse && <UpdateCourseModal />}
        </div>
    );
};


export default Page