import { RootState } from '@/lib/redux/Store';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        phone_number: string;
        organization: string;
        origin: string;
        note: string;
    }

}

const SearchClient: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    const { totalClients } = useSelector((state: RootState) => state.manageClient)
    return (
        <div className='pt-4 mt-4 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                Search Client
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder='Name'
                        name='name'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder='Phone #'
                        name='phone_number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <input type="text"
                        placeholder='Organization'
                        name='organization'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <input type="text"
                        placeholder='Origin'
                        name='origin'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <input type="text"
                        placeholder='Note'
                        name='note'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.note}
                    />

                    <div className='flex flex-col px-3 pt-3 pb-2 mt-2 border-t'>
                        <div className='font-medium mb-1'>Result: <span className='text-sm font-black text-gray-600'>{totalClients.searched}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchClient;
