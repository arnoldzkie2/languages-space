'use client'
import { createSlice } from "@reduxjs/toolkit"
import { ManageClientInitialState } from "./ManageClientState"
import { newClientFormValue } from "./DefaultValues"

export const ManageClientSlice = createSlice({
    name: 'manage_client',
    initialState: ManageClientInitialState,
    reducers: {
        setClients: (state, { payload }) => {
            state.clients = payload
        },
        setNewClient: (state) => {
            state.newClient = !state.newClient
        },
        setNewClientForm: (state, { payload }) => {
            state.newClientForm = payload
        },
        setMethod: (state, { payload }) => {
            state.method = payload
        },
        setClientData: (state, { payload }) => {
            state.clientData = payload
        },
        setDeleteModal: (state, { payload }) => {
            state.deleteModal = payload
        },
        setOperation: (state, { payload }) => {
            state.operation = payload
        },
        setTotalClients: (state, { payload }) => {
            state.totalClients = payload
        },
        openOperation: (state, { payload }) => {
            state.clientSelectedID = payload
            state.operation = true
        },
        closeOperation: (state) => {
            state.clientSelectedID = ''
            state.operation = false
        },
        closeViewModal: (state) => {
            state.viewClientModal = false
            state.clientData = undefined
        },
        viewClient: (state, { payload }) => {
            state.operation = false
            state.clientData = payload
            state.viewClientModal = true
        },
        closeDeleteModal: (state) => {
            state.deleteModal = false
            state.clientData = undefined
        },
        closeNewClientModal: (state) => {
            state.newClient = false
            state.newClientForm = newClientFormValue
        },
        newOrUpdateClient: (state, { payload }) => {
            const { type, client } = payload
            state.newClient = true
            if (type === 'new') {
                state.method = 'new'
            } else {
                state.method = 'update'
                state.newClientForm = client
            }
        },
        setEye: (state) => {
            state.eye = !state.eye
        },
        deleteWarning: (state, { payload }) => {
            state.deleteModal = true
            state.clientData = payload
            state.operation = false
            state.clientSelectedID = ''
        },
        setSelectedClients: (state, { payload }) => {
            state.selectedClients = payload
        },
        successNewClient: (state) => {
            state.newClient = false
            state.newClientForm = newClientFormValue
        },
        successDeleteClient: (state) => {
            state.deleteModal = false
            state.clientData = undefined
        }
    }
})

export const { setClients, setNewClient, setNewClientForm,
    setMethod, setClientData, setDeleteModal, setOperation,
    setTotalClients, openOperation, closeOperation, closeViewModal, viewClient,
    closeDeleteModal, closeNewClientModal, newOrUpdateClient, setEye, deleteWarning, setSelectedClients,
    successNewClient, successDeleteClient } = ManageClientSlice.actions

export default ManageClientSlice.reducer