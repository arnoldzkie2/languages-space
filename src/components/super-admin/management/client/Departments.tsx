'use client'

import React, { Dispatch, SetStateAction } from "react";
import { DepartmentsProps } from "./Types";

interface Props {

    departments: DepartmentsProps[]

    departmentID: string

    setDepartmentID: Dispatch<SetStateAction<string>>
    
}

const Departments: React.FC<Props> = ({ departments, setDepartmentID }) => {

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedId = event.target.value;

        setDepartmentID(selectedId)
    };

    return (
        <>
            <select onChange={handleDepartmentChange} className="bg-slate-50 border rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 outline-none">
                <option value=''>All Department</option>
                {departments &&
                    departments.length > 0 &&
                    departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
            </select>
        </>
    );
};

export default Departments;
