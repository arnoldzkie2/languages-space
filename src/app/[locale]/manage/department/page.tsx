/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import SideNav from '@/components/super-admin/SideNav'
import Pagination from '@/components/super-admin/management/Pagination'
import DeleteCardWarningModal from '@/components/super-admin/management/client-card/DeleteCardWarningModal'
import DeleteDepartmentWarningModal from '@/components/super-admin/management/department/DeleteDepartmentWarningModal'
import DepartmentHeader from '@/components/super-admin/management/department/DepartmentHeader'
import DepartmentTable from '@/components/super-admin/management/department/DepartmentTable'
import NewDepartmentModal from '@/components/super-admin/management/department/NewDepartmentModal'
import SearchDepartment from '@/components/super-admin/management/department/SearchDepartment'
import UpdateDepartmentModal from '@/components/super-admin/management/department/UpdateDepartmentModal'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Page = () => {

    const { isSideNavOpen, currentPage, setIsLoading, itemsPerPage,
        departments, getDepartments, newDepartment, updateDepartment, totalDepartment, setTotalDepartments, closeDeleteDepartment, deleteDepartment } = useAdminGlobalStore()

    const [searchQuery, setSearchQuery] = useState('')

    const filterDepartments = departments.filter(dept => dept.name.toUpperCase().includes(searchQuery.toUpperCase()))

    const indexOfLastItem = currentPage * itemsPerPage

    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentDepartments = filterDepartments.slice(indexOfFirstItem, indexOfLastItem)

    const getTotalPages = () => Math.ceil(departments.length / itemsPerPage)

    const deleteSingleDepartment = async (e: any, departmentID: string) => {

        e.preventDefault()

        try {
            setIsLoading(true)
            const { data } = await axios.delete('/api/department', {
                params: { departmentID }
            })

            if (data.ok) {
                getDepartments()
                setIsLoading(false)
                closeDeleteDepartment()
                alert('Success')

            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);
            alert('Something went wrong')
        }
    }


    useEffect(() => {
        getDepartments()
    }, [])

    useEffect(() => {

        setTotalDepartments({
            selected: '',
            searched: filterDepartments.length.toString(),
            total: departments.length.toString()
        })

    }, [departments.length, filterDepartments.length])

    return (
        <div className='flex h-screen'>
            <SideNav />
            <div className={`flex flex-col gap-8 w-full h-full ${isSideNavOpen ? 'pl-44' : 'pl-16'}`}>

                <DepartmentHeader />
                <div className={`flex w-full h-full px-8 gap-8 items-start  `}>

                    <div className='border py-3 px-6 flex flex-col shadow bg-white w-1/6 gap-4'>
                        <SearchDepartment searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>

                    <DepartmentTable filteredTable={currentDepartments} />

                </div>

                <Pagination totals={totalDepartment} getTotalPages={getTotalPages} />
            </div>

            {newDepartment && <NewDepartmentModal />}
            {updateDepartment && <UpdateDepartmentModal />}
            {deleteDepartment && <DeleteDepartmentWarningModal deleteDepartment={deleteSingleDepartment} />}

        </div>
    )
}

export default Page