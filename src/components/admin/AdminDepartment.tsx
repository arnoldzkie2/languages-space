/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useRouter } from "@/lib/navigation";
import useAdminPageStore from "@/lib/state/admin/adminPageStore";
import useGlobalStore from "@/lib/state/globalStore";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const AdminDepartment = () => {

    const router = useRouter()

    const { adminDepartments, getAdminDepartments, admin, getPermissions } = useAdminPageStore()
    const { departmentID, setDepartmentID } = useGlobalStore()

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        setDepartmentID(selectedId)
        getPermissions(selectedId)
        router.push('/admin')
    };

    useEffect(() => {
        if (!adminDepartments && admin) getAdminDepartments()
    }, [admin])

    const t = useTranslations('super-admin')

    return (
        <div className="relative w-full">
            <select onChange={handleDepartmentChange} value={departmentID} id="department" className="text-gray-600 w-full border text-sm rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 pr-7 appearance-none outline-none cursor-pointer">
                <option value=''>{t('department.select')}</option>
                {adminDepartments &&
                    adminDepartments.length > 0 &&
                    adminDepartments.map((department) => (
                        <option key={department.department.id} value={department.department.id}>
                            {department.department.name}
                        </option>
                    ))}
            </select>
            <FontAwesomeIcon width={16} height={16} icon={faChevronDown} className="absolute right-3 top-3 text-gray-500" />
        </div>
    )
};

export default AdminDepartment;
