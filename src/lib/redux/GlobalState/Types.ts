interface DepartmentsProps {
    id: string,
    name: string,
    date: string
}

interface GlobalState {
    departments: DepartmentsProps[]
    currentPage: number
    isSideNavOpen: boolean
    departmentID: string
    isCreatingDepartment: boolean
}


export type { GlobalState, DepartmentsProps }

