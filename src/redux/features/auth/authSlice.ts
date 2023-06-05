import { createSlice } from "@reduxjs/toolkit"

export interface AuthState {
    isText: boolean
    error: string
    login: {
        user_name: string
        password: string
    }
    signup: {
        name: string
        user_name: string
        password: string
        confirm_password: string
    }
}

const initialState: AuthState = {

    isText: false,

    error: '',

    login: {
        user_name: '',
        password: '',
    },

    signup: {
        name: '',
        user_name: '',
        password: '',
        confirm_password: ''
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logUsername: (state, action) => { state.login.user_name = action.payload },
        logPassword: (state, action) => { state.login.password = action.payload },
        handleEye: (state) => { state.isText = !state.isText },
        regName: (state, action) => { state.signup.name = action.payload },
        regUsername: (state, action) => { state.signup.user_name = action.payload },
        regPassword: (state, action) => { state.signup.password = action.payload },
        regConfirmPassword: (state, action) => { state.signup.confirm_password = action.payload },
        setError: (state, action) => { state.error = action.payload }
    }
})

export const { logUsername, logPassword, handleEye, regName, regUsername, regPassword, regConfirmPassword, setError } = authSlice.actions;

export default authSlice.reducer