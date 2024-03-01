'use client';
import SideNav from '@/components/super-admin/SideNav';
import Pagination from '@/components/super-admin/management/Pagination';
import DeleteDepartmentWarningModal from '@/components/super-admin/management/department/DeleteDepartment';
import DepartmentHeader from '@/components/super-admin/management/department/DepartmentHeader';
import DepartmentTable from '@/components/super-admin/management/department/DepartmentTable';
import NewDepartmentModal from '@/components/super-admin/management/department/NewDepartmentModal';
import UpdateDepartmentModal from '@/components/super-admin/management/department/UpdateDepartmentModal';
import { Input } from '@/components/ui/input';
import useGlobalStore from '@/lib/state/globalStore';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';
import { Department } from '@prisma/client';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const Page = () => {

    const { isSideNavOpen, currentPage, itemsPerPage } = useGlobalStore();
    const { departments, getDepartments, setTotalDepartment, totalDepartment } = useDepartmentStore()
    const [searchQuery, setSearchQuery] = useState('');

    const filterDepartments: Department[] = departments && departments.filter(dept => dept.name.toUpperCase().includes(searchQuery.toUpperCase())) || []
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDepartments = filterDepartments.slice(indexOfFirstItem, indexOfLastItem);
    const getTotalPages = () => Math.ceil((departments && departments.length || 1) / itemsPerPage)

    useEffect(() => {
        getDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        setTotalDepartment({
            selected: '',
            searched: filterDepartments.length.toString(),
            total: departments && departments.length.toString() || ''
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departments, filterDepartments.length]);

    const t = useTranslations('')

    return (
        <div className='flex h-screen'>
            <SideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <DepartmentHeader />
                <div className={`flex w-full h-full px-8 gap-8 items-start  `}>

                    <div className='border py-3 px-6 flex flex-col shadow bg-card w-1/6 gap-4'>
                        <div className='w-full'>
                            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                                {t('department.search')}
                            </div>
                            <div>
                                <div className='flex flex-col gap-3'>
                                    <Input type="text"
                                        placeholder={t('info.name')}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        value={searchQuery}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DepartmentTable filteredTable={currentDepartments} />
                </div>
                <Pagination totals={totalDepartment} getTotalPages={getTotalPages} />
            </div>

            <NewDepartmentModal />
            <UpdateDepartmentModal />
        </div>
    );
};

export default Page