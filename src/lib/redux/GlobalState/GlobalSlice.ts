import { createSlice } from "@reduxjs/toolkit";
import { globalState } from "./GlobalState";


const GlobalSlice = createSlice({
    name: 'global',
    initialState: globalState,
    reducers: {
        setDepartments: (state, { payload }) => {
            state.departments = payload
        },
        setCurrentPage: (state, { payload }) => {
            state.currentPage = payload
        },
        setIsSideNavOpen: (state) => {
            state.isSideNavOpen = !state.isSideNavOpen
        },
        setDepartmentID: (state, { payload }) => {
            state.departmentID = payload
        },
        setIsCreatingDepartment: (state) => {
            state.isCreatingDepartment = !state.isCreatingDepartment
        }
    }
})

export const { setDepartments, setCurrentPage, setIsSideNavOpen, setDepartmentID, setIsCreatingDepartment } = GlobalSlice.actions
export default GlobalSlice.reducer