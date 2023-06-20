'use client'

import { configureStore } from "@reduxjs/toolkit"
import ManageClientReducer from './ManageClient/ManageClientSlice'
import GlobalStateReducer from './GlobalState/GlobalSlice'
import ManageWebReducer from './ManageWeb/ManageWebSlice'
export const store = configureStore({
    reducer: {
        manageClient: ManageClientReducer,
        globalState: GlobalStateReducer,
        manageWeb: ManageWebReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch