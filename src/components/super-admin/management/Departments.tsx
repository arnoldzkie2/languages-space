/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { setDepartmentID, setDepartments } from "@/lib/redux/GlobalState/GlobalSlice";
import { RootState } from "@/lib/redux/Store";
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

    const getAllDepartment = async () => {

        try {

            const { data } = await axios.get('/api/department')

            if (data.success) {

                return dispatch(setDepartments(data.data))

            }

            alert('Something went wrong')

        } catch (error) {

            console.log(error);
        }
    }

    useEffect(() => {

        getAllDepartment()

    }, [])

    const t = useTranslations('global')

    return (
            <select onChange={handleDepartmentChange} className="border text-sm rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 outline-none cursor-pointer">
                <option value=''>{t('department.all')}</option>
                {departments &&
                    departments.length > 0 &&
                    departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
            </select>
    );
};

export default Departments;
