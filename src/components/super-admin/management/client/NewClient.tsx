/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useSession } from 'next-auth/react';
import { closeNewClientModal, setNewClientForm, setEye } from '@/lib/redux/ManageClient/ManageClientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';
import { NewClientForm } from '@/lib/redux/ManageClient/Types';

interface Props {

    addOrUpdateClient: (event: any) => Promise<void>

}

const NewClient: React.FC<Props> = ({ addOrUpdateClient }) => {

    const { data }: any = useSession()

    const { departments } = useSelector((state: RootState) => state.globalState)

    const { method, newClientForm, eye } = useSelector((state: RootState) => state.manageClient)

    const [defaultNewClientForm, setDefaultNewClientForm] = useState<NewClientForm>(newClientForm)

    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    const dispatch = useDispatch()

    const handleChange = (e: any) => {

        const { name, value, type } = e.target;

        if (type === 'checkbox') {

            if (selectedDepartments.includes(value)) {

                setSelectedDepartments((prevSelectedDepartments) =>
                    prevSelectedDepartments.filter((dept) => dept !== value)
                );

            } else {

                setSelectedDepartments((prevSelectedDepartments) => [
                    ...prevSelectedDepartments,
                    value,
                ]);

            }

        } else if (type === 'file') {

            const profile = e.target.files?.[0] || null;
            const reader: any = new FileReader();
            reader.readAsDataURL(profile)
            reader.onload = () => {
                setDefaultNewClientForm(prevData => ({
                    ...prevData, profile: reader.result
                }))
            }

        } else {

            setDefaultNewClientForm((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
        }

    };

    useEffect(() => {

        setDefaultNewClientForm(prevForm => ({
            ...prevForm,
            departments: selectedDepartments,
        }));

        if (data.user.user === 'super-admin') {

            setDefaultNewClientForm(prevForm => ({

                ...prevForm, origin: 'admin'

            }))
        }

        dispatch(setNewClientForm(defaultNewClientForm))

    }, [selectedDepartments])

    useEffect(() => {

        dispatch(setNewClientForm(defaultNewClientForm))

    }, [defaultNewClientForm])

    useEffect(() => {
        if (newClientForm.departments && newClientForm.departments.length > 0) {

            const updatedSelectedDepartments = newClientForm.departments.filter((deptId) =>
                departments.some((dept) => dept.id === deptId)
            );

            setSelectedDepartments(updatedSelectedDepartments);

        }
    }, [])

    return (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center bg-gray-500 bg-opacity-60 py-10 px-96 z-20'>
            <div className='p-8 h-full w-full bg-white relative rounded-xl shadow-md    '>

                <FontAwesomeIcon icon={faXmark} className='absolute right-5 top-5 cursor-pointer text-2xl' onClick={() => dispatch(closeNewClientModal())} />

                <form onSubmit={addOrUpdateClient} className='flex flex-col p-5 h-full w-full'>

                    <div className='flex gap-10 w-full'>

                        <div className='flex w-1/2 flex-col p-7 border gap-3'>

                            <div className=''>
                                <label htmlFor='name' className='block font-medium'>
                                    Name
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    required
                                    value={newClientForm.name || ''}
                                    onChange={handleChange}
                                    placeholder='Enter full name'
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                            <div className=''>
                                <label htmlFor='user_name' className='block font-medium'>
                                    Username
                                </label>
                                <input
                                    type='text'
                                    id='user_name'
                                    name='user_name'
                                    required
                                    placeholder='Create username'
                                    value={newClientForm.user_name || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                            <div className=''>
                                <label htmlFor='email' className='block font-medium'>
                                    Email
                                </label>
                                <input
                                    type='text'
                                    id='email'
                                    name='email'
                                    placeholder='Enter email'
                                    value={newClientForm.email || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                            <div className='relative'>
                                <label htmlFor='password' className='block font-medium'>
                                    Password
                                </label>
                                <input
                                    type={eye ? 'password' : 'text'}
                                    id='password'
                                    name='password'
                                    required
                                    placeholder='Create password'
                                    value={newClientForm.password || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                                {newClientForm.password && <FontAwesomeIcon icon={eye ? faEye : faEyeSlash} className='absolute bottom-3 right-4 text-gray-600 cursor-pointer' onClick={() => dispatch(setEye())} />}
                            </div>

                            <div className=''>
                                <label htmlFor='phone_number' className='block font-medium'>
                                    Phone number
                                </label>
                                <input
                                    type='text'
                                    id='phone_number'
                                    name='phone_number'
                                    placeholder='Enter phone number'
                                    value={newClientForm.phone_number || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                            <div className=''>
                                <label htmlFor='organization' className='block font-medium'>
                                    Organization
                                </label>
                                <input
                                    type='text'
                                    id='organization'
                                    name='organization'
                                    placeholder='Enter organizaion'
                                    value={newClientForm.organization || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                        </div>

                        <div className='flex w-1/2 flex-col p-7 border gap-4'>

                            <div>
                                <label htmlFor="address" className='block font-medium'>Address</label>
                                <input
                                    type='text'
                                    id='address'
                                    name='address'
                                    placeholder='Enter address'
                                    value={newClientForm.address || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                            <div>
                                <label htmlFor="note" className='block font-medium'>Note</label>
                                <input
                                    type='text'
                                    id='note'
                                    name='note'
                                    placeholder='Enter note(optional)'
                                    value={newClientForm.note || ''}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 outline-none px-3 py-2 rounded'
                                />
                            </div>

                            <div className=''>
                                <label className='block font-medium'>Departments</label>
                                {departments && departments.map((dept) => (
                                    <div key={dept.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`department_${dept.id}`}
                                            name={`department_${dept.id}`}
                                            value={dept.id}
                                            checked={selectedDepartments.includes(dept.id)}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`department_${dept.id}`} className="mr-4">{dept.name}</label>
                                    </div>
                                ))}
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="gender" className='block font-medium'>Gender</label>
                                <select name="gender" id='gender' className='border py-2 px-1 outline-none' onChange={handleChange} value={newClientForm.gender || ''}>
                                    <option value='others'>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others...</option>
                                </select>
                            </div>

                            <div className=''>
                                <label htmlFor='profile' className='block font-medium'>Profile Image</label>
                                <input
                                    type='file'
                                    id='profile'
                                    name='profile'
                                    accept='image/*'
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                    </div>

                    <button className='border mt-5 w-1/5 py-2 bg-gray-900 rounded-md text-white'>{method === 'new' ? 'Add Client' : 'Update Client'}</button>

                </form>
            </div>
        </div>
    );
};


export default NewClient;
