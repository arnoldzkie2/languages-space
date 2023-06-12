import React, { Dispatch, SetStateAction } from 'react';
import { ClientsProps, DepartmentsProps } from './Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface Props {

    clientData: ClientsProps | undefined

    closeViewModal: () => void

    departments: DepartmentsProps[]
}

const ClientModal: React.FC<Props> = ({ clientData, closeViewModal, departments }) => {

    const availableDepartments = departments.filter((department) =>
        clientData?.departments?.includes(department.id.toString())
    );

    const departmentOptions = availableDepartments.map((department) => (
        <option key={department.id}>
            {department.name}
        </option>
    ));

    const date = clientData?.date ? new Date(clientData.date) : null;

    const formattedDate = date ? date.toLocaleString() : '';

    const copy = (value: any) => {
    
        navigator.clipboard.writeText(value)

        alert(`Copied ${value}`)

    }
    return (

        <div className='fixed top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-60 grid place-items-center py-24 px-72'>
            <form className='w-full h-full bg-white border shadow-lg rounded-2xl p-10 relative flex items-center'>
                <FontAwesomeIcon icon={faXmark} className='absolute right-5 top-5 text-2xl cursor-pointer' onClick={closeViewModal} />
                <div className='flex flex-col border p-10'>
                    <Image src={clientData?.profile ? clientData.profile : clientData?.gender === 'male' ? '/gender/male.png' : '/gender/female.png'} width={200} height={200} className='rounded-full' alt='Profile'  />
                    <div className='font-bold my-3 py-2 border-b text-center'>{clientData?.name}</div>
                    <div>{clientData?.email || 'noemail@default.com'}</div>
                    <select className='border py-2 px-2 mt-5 outline-none' read-only="true">
                        <option>Departments</option>
                        {departmentOptions}
                    </select>
                </div>
                <div className='flex flex-col w-full h-full gap-2 ml-10 justify-center'>
                    <label className='font-bold text-sm'>ID:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.id} />

                    <label className='font-bold text-sm'>PHONE NUMBER:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.phone_number || 'No Data'} />

                    <label className='font-bold text-sm'>ADDRESS:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.address || 'No Data'} />

                    <label className='font-bold text-sm'>EMAIL:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.email || 'No Data'} />

                    <label className='font-bold text-sm'>GENDER:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.gender || 'No Data'} />
                </div>
                <div className='flex flex-col w-full h-full gap-2 justify-center'>

                    <label className='font-bold text-sm'>CREATION DATE:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' value={formattedDate} onClick={(e: any) => copy(e.target.value)} />

                    <label className='font-bold text-sm'>ORIGIN:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.origin || 'No Data'} />

                    <label className='font-bold text-sm'>ORGANIZATION:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.organization || 'No Data'} />

                    <label className='font-bold text-sm'>NOTE:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-2/3 cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={clientData?.note || 'No Data'} />
                </div>
            </form>
        </div>

    );
};

export default ClientModal;
