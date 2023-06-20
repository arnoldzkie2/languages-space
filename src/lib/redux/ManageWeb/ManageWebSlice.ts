import { createSlice } from "@reduxjs/toolkit";
import { ManageWebInitialState } from "./ManageWebState";
import { newsValue } from "./DefaultValue";

const ManageWebSlice = createSlice({
    name: 'manage_web',
    initialState: ManageWebInitialState,
    reducers: {
        setTotalNews: (state, { payload }) => {
            state.totalNews = payload
        },
        setNews: (state, { payload }) => {
            state.news = payload
        },
        setSelectedNews: (state, { payload }) => {
            state.selectedNews = payload
        },
        setNewsSelectedID: (state, { payload }) => {
            state.newsSelectedID = payload
        },
        openOperation: (state, { payload }) => {
            state.operation = true
            state.newsSelectedID = payload
        },
        closeOperation: (state) => {
            state.operation = false
            state.newsSelectedID = ''
        },
        openNewsDeleteWarning: (state, { payload }) => {
            state.deleteWarning = true
            state.operation = false
            state.targetNews = payload
        },
        closeNewsDeleteWarning: (state) => {
            state.deleteWarning = false
            state.targetNews = newsValue
        }
    }
})

export const { setTotalNews, setNews, setSelectedNews, setNewsSelectedID, openOperation, closeOperation, openNewsDeleteWarning, closeNewsDeleteWarning } = ManageWebSlice.actions

export default ManageWebSlice.reducer