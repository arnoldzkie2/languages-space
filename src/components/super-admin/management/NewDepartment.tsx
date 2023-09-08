'use client'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const NewDepartment: React.FC = ({ }) => {

    return (
        <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer text-gray-600">
            <div>Department</div>
            <FontAwesomeIcon icon={faPlus} />
        </li>
    );
};

export default NewDepartment;
