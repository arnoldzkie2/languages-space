import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        id: string;
        name: string;
        phone_number: string;
        organization: string;
        origin: string;
    }
}

const Search: React.FC<Props> = ({ handleSearch, searchQuery }) => {
    return (
        <div className='pt-5 mt-5 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-2 font-bold px-2'>
                Search Client
            </div>
            <div>
                <div className='flex flex-col text-gray-700'>
                    <input type="text"
                        placeholder='ID'
                        name='id'
                        className='w-full border my-2 px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.id}
                    />

                    <input type="text"
                        placeholder='Name'
                        name='name'
                        className='w-full border my-2 px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.name}
                    />

                    <input type="text"
                        placeholder='Phone #'
                        name='phone_number'
                        className='w-full border my-2 px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.phone_number}
                    />

                    <input type="text"
                        placeholder='Organization'
                        name='organization'
                        className='w-full border my-2 px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.organization}
                    />

                    <input type="text"
                        placeholder='Origin'
                        name='origin'
                        className='w-full border my-2 px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.origin}
                    />

                </div>
            </div>
        </div>
    );
};

export default Search;
