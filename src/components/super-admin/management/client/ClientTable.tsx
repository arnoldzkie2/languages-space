import React from 'react';

interface ClientTableProps {
    data: {
        id: string
        name: string
        date: string
    }[]
    searchQueries: {

    }
}

const ClientTable: React.FC<ClientTableProps> = ({ data, searchQueries }) => {

    return (
        <>
            

        </>
    );
};

export default ClientTable;
