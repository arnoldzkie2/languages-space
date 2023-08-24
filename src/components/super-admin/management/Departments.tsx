/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getAllDepartment } from "@/lib/fetchData/department";
import { setDepartmentID, setDepartments } from "@/lib/redux/GlobalState/GlobalSlice";
import { RootState } from "@/lib/redux/Store";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Departments = () => {

    const { departments } = useSelector((state: RootState) => state.globalState)

    const dispatch = useDispatch()

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedId = event.target.value;

        dispatch(setDepartmentID(selectedId))

    };

    useEffect(() => {

        const getAllDepartments = async () => {

            const allDepartments = await getAllDepartment()

            dispatch(setDepartments(allDepartments))
        }

        getAllDepartments()

    }, [])

    const t = useTranslations('global')

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="font-medium px-2">{t('department.select')}</div>
            <div className="relative">
                <select onChange={handleDepartmentChange} className="text-gray-600 w-full border text-sm rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 pr-7 appearance-none outline-none cursor-pointer">
                    <option value=''>{t('department.all')}</option>
                    {departments &&
                        departments.length > 0 &&
                        departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-2 top-4 text-gray-500 text-xs" />
            </div>
        </div>
    );
};

export default Departments;
