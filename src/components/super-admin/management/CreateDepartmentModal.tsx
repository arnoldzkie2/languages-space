import { setIsCreatingDepartment } from '@/lib/redux/GlobalState/GlobalSlice';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';


const CreateDepartmentModal: React.FC = ({ }) => {

    const [name, setName] = useState('')

    const addNewDepartment = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if (!name) return alert('Fill up the input to create department')

        try {

            const { data } = await axios.post('/api/department', {
                name
            })

            if (data.success) dispatch(setIsCreatingDepartment())

        } catch (error) {
            console.log(error);
        }
    }

    const dispatch = useDispatch()

    return (
        <div className='fixed z-30 top-0 left-0 w-screen h-screen bg-gray-700 bg-opacity-50 grid place-items-center'>
            <div className=' bg-white rounded-xl shadow-lg relative p-10 flex flex-col items-center gap-5'>
                <FontAwesomeIcon icon={faXmark} className='absolute right-4 top-4 text-xl font-bold cursor-pointer' onClick={() => dispatch(setIsCreatingDepartment())} />
                
                <h1 className='text-gray-800 text-2xl font-bold'>Create Department</h1>

                <form className='flex flex-col gap-5' onSubmit={addNewDepartment}>

                    <input type="text"
                        placeholder='Department name'
                        className='outline-none py-2 border-b border-gray-500'
                        value={name} onChange={(e: any) => setName(e.target.value)} />
                    <button className='py-2 bg-blue-600 text-white text-lg rounded-md outline-none'>Create</button>
                </form>

            </div>
        </div>
    );
};

export default CreateDepartmentModal;
