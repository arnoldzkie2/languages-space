import { newClientFormValue, totalClientsValue } from "./DefaultValues";
import { ManageClientState } from "./Types";

export const ManageClientInitialState: ManageClientState = {
    clients: [],
    newClient: false,
    newClientForm: newClientFormValue,
    method: '',
    clientData: undefined,
    deleteModal: false,
    operation: false,
    totalClients: totalClientsValue,
    clientSelectedID: '',
    viewClientModal: false,
    eye: true,
    selectedClients: []
}