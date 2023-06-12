'use client'

import React, { Dispatch, SetStateAction, useContext } from "react";
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
        <div className="flex flex-col">
            <div className="p-2 font-medium">Select Department</div>
            <select onChange={handleDepartmentChange} className="border text-sm rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 outline-none cursor-pointer">
                <option value=''>All Clients</option>
                {departments &&
                    departments.length > 0 &&
                    departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default Departments;
