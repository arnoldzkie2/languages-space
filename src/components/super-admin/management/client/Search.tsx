import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        phone_number: string;
        organization: string;
        origin: string;
    }

    totalClients: {
        total: string;
        searched: string;
        selected: string;
    }

}

const Search: React.FC<Props> = ({ handleSearch, searchQuery, totalClients }) => {
    return (
        <div className='pt-5 mt-5 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                Search Client
            </div>
            <div>
                <div className='flex flex-col text-gray-700 gap-3'>

                    <input type="text"
                        placeholder='Name'
                        name='name'
                        className='w-full border px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder='Phone #'
                        name='phone_number'
                        className='w-full border px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <input type="text"
                        placeholder='Organization'
                        name='organization'
                        className='w-full border px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <input type="text"
                        placeholder='Origin'
                        name='origin'
                        className='w-full border px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                    <div className='flex flex-col p-3 border'>
                        <div className='font-medium mb-1'>Total Clients</div>
                        <div className='text-sm font-black text-gray-600'>{totalClients.total}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
