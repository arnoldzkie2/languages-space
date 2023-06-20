'use client'
import { setIsCreatingDepartment } from '@/lib/redux/GlobalState/GlobalSlice';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch } from 'react-redux';


const NewDepartment: React.FC = ({ }) => {

    const dispatch = useDispatch()

    return (
        <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer text-gray-600" onClick={() => dispatch(setIsCreatingDepartment())}>
            <div>Department</div>
            <FontAwesomeIcon icon={faPlus} />
        </li>
    );
};

export default NewDepartment;
