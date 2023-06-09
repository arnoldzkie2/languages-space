import React from 'react';
import { ClientsProps } from './Types';

interface Props {

    clientData: ClientsProps | undefined

}

const ClientModal: React.FC<Props> = ({ clientData }) => {

    return (

        <div>Hello {clientData?.name}</div>

    );
};

export default ClientModal;
