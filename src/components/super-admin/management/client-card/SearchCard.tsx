import React, { ChangeEvent } from 'react';

interface Props {

    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void

    searchQuery: {
        name: string;
        price: string
        validity: string;
    }

}

const SearchClientCard: React.FC<Props> = ({ handleSearch, searchQuery }) => {

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center mb-2 font-medium px-2'>
                Search Card
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

                    <input
                        placeholder='Price'
                        name='price'
                        type='number'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.price ? searchQuery.price : ''}
                    />

                    <input type="text"
                        placeholder='Validity'
                        name='validity'
                        className='w-full border text-sm px-3 outline-none py-2'
                        onChange={handleSearch}
                        value={searchQuery.validity}
                    />

                </div>
            </div>
        </div>
    );
};

export default SearchClientCard;
