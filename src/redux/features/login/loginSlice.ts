'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface LoginState {
    user_name: string,
    password: string,
    isText: boolean
}

const initialState: LoginState = {
    user_name: '',
    password: '',
    isText: false
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        handleUsername: (state, action) => { state.user_name = action.payload },
        handlePassword: (state, action) => { state.password = action.payload },
        handleEye: (state) => { state.isText = !state.isText }
    }
})

export const { handleUsername, handlePassword, handleEye } = loginSlice.actions;

export default loginSlice.reducer