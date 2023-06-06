import { createSlice } from "@reduxjs/toolkit"

export interface SearchSlice {
    id: string
    name: string
    gender: string
    age: number | string
    organization: string
    origin: string
    phone_number: string
    email: string
    type: string
}

const initialState: SearchSlice = {
    id: '',
    name: '',
    gender: '',
    age: '',
    organization: '',
    origin: '',
    phone_number: '',
    email: '',
    type: ''
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    }
})

export const { } = authSlice.actions;

export default authSlice.reducer