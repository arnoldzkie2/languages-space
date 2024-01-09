/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import useGlobalStore from "@/lib/state/globalStore";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const Departments = () => {

    const { departments, getDepartments, setDepartmentID, departmentID } = useGlobalStore()

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        setDepartmentID(selectedId)
    };

    useEffect(() => {
        setDepartmentID('')
        getDepartments()
    }, [])

    const t = useTranslations('super-admin')

    return (
        <div className="relative">
            <select onChange={handleDepartmentChange} value={departmentID} id="department" className="text-gray-600 w-full border text-sm rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 pr-7 appearance-none outline-none cursor-pointer">
                <option value=''>{t('global.department.all')}</option>
                {departments &&
                    departments.length > 0 &&
                    departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
            </select>
            <FontAwesomeIcon width={16} height={16} icon={faChevronDown} className="absolute right-3 top-3 text-gray-500" />
        </div>
    )
};

export default Departments;
