import React from 'react';
import { ClientsProps } from './Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

interface Props {

    clients: ClientsProps[]

    deleteWarning: (client: ClientsProps) => void

    operation: boolean

    clientSelectedID: string | undefined

    handleOperation: (ID: string | undefined) => void

    closeOperation: () => void

    viewClient: (clientData: ClientsProps) => Promise<void>

}

const ClientTable: React.FC<Props> = ({ clients, deleteWarning, clientSelectedID, operation, handleOperation, closeOperation, viewClient }) => {

    return (
        <table className="text-sm text-left text-gray-800 shadow-md w-5/6">
            <thead className="text-xs uppercase bg-slate-50 border">
                <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Phone Number</th>
                    <th scope="col" className="px-6 py-3">Organization</th>
                    <th scope="col" className="px-6 py-3">Origin</th>
                    <th scope="col" className="px-6 py-3">Operation</th>
                </tr>
            </thead>
            <tbody>
                {clients && clients.length > 0 ?
                    clients.map(client => (
                        <tr className="bg-white border hover:bg-slate-50" key={client.id}>
                            <td className='px-6 py-2'>{client.id}</td>
                            <td className="px-6 py-2">{client.name}</td>
                            <td className='px-6 py-2'>{client.phone_number ? client.phone_number : 'No Data'}</td>
                            <td className="px-6 py-2">{client.organization ? client.organization : 'No Data'}</td>
                            <td className="px-6 py-2">{client.origin ? client.origin : 'No Data'}</td>
                            <td className='px-6 py-2 relative text-center'>
                                <FontAwesomeIcon icon={faEllipsis} className='cursor-pointer text-2xl text-black' onClick={() => handleOperation(client.id)} />
                                <ul className={`${operation && clientSelectedID === client.id ? 'block' : 'hidden'} absolute bg-white p-3 gap-2 z-10 w-24 shadow-lg border flex flex-col text-gray-600`}>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-green-500' onClick={() => viewClient(client)}>View <FontAwesomeIcon icon={faEye} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-blue-600'>Update <FontAwesomeIcon icon={faPenToSquare} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-red-600' onClick={() => deleteWarning(client)}>Delete <FontAwesomeIcon icon={faTrashCan} /></li>
                                    <li className='flex mb-1 justify-between items-center cursor-pointer hover:text-black pt-2 border-t border-r-gray-700' onClick={closeOperation}>Close <FontAwesomeIcon icon={faXmark} /></li>
                                </ul>
                            </td>
                        </tr>
                    )) :
                    <tr className="bg-white border hover:bg-slate-50">
                        <td className='px-6 py-4'>This</td>
                        <td className="px-6 py-4">Department</td>
                        <td className='px-6 py-4'>Has</td>
                        <td className="px-6 py-4">No</td>
                        <td className="px-6 py-4">Data</td>
                        <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faEllipsis} className='text=gray-600 text-2xl' /></td>
                    </tr>}
            </tbody>
        </table>
    );
};

export default ClientTable;
