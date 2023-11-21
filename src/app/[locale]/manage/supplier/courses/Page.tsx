/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import SideNav from '@/components/super-admin/SideNav';
import Pagination from '@/components/super-admin/management/Pagination';
import CourseHeader from '@/components/super-admin/management/supplier/courses/CoursesHeader';
import CoursesTable from '@/components/super-admin/management/supplier/courses/CoursesTable';
import NewCourseModal from '@/components/super-admin/management/supplier/courses/NewCourseModal';
import SearchCourse from '@/components/super-admin/management/supplier/courses/SearchCourse';
import UpdateCourseModal from '@/components/super-admin/management/supplier/courses/UpdateCourseModal';
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore';
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export const Page = () => {

    const session = useSession({
        required: true,
        onUnauthenticated() {
            signIn();
        },
    });

    const { currentPage, isSideNavOpen, itemsPerPage } = useAdminGlobalStore();

    const { courses, getCourses, newCourse, updateCourse, totalCourse, setTotalCourse } = useAdminSupplierStore();

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

    return (
        <div className='h-screen'>
            <SideNav />
            <div className={`flex flex-col h-full w-full gap-8 ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <CourseHeader />

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
