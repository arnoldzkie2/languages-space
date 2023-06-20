'use client'

import { setDepartmentID } from "@/lib/redux/GlobalState/GlobalSlice";
import { RootState } from "@/lib/redux/Store";
import { useDispatch, useSelector } from "react-redux";

const Departments = () => {

    const { departments } = useSelector((state: RootState) => state.globalState)

    const dispatch = useDispatch()

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedId = event.target.value;
        
        dispatch(setDepartmentID(selectedId))
    };

    return (
        <div className="flex flex-col">
            <div className="p-2 font-medium">Select Department</div>
            <select onChange={handleDepartmentChange} className="border text-sm rounded-sm focus:ring-blue-600 focus:border-blue-600 block p-2.5 outline-none cursor-pointer">
                <option value=''>All Departments</option>
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
