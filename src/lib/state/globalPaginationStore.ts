import { create } from 'zustand'

interface GlobalPaginationStore {
    goToPreviousPage: () => void
    itemsPerPage: number
    setCurrentPage: (num: number) => void
    currentPage: number
    getTotalPages: (data: any[]) => number
    goToNextPage: (data: any[]) => void
    indexOfLastItem: () => number
    indexOfFirstItem: () => number
    getCurrentData: (data: any[] | null) => any[] | null
}

const useGlobalPaginationStore = create<GlobalPaginationStore>((set, get) => ({
    currentPage: 1,
    itemsPerPage: 10,
    goToPreviousPage: () => {
        const { currentPage } = get()
        if (currentPage > 1) {
            set({ currentPage: currentPage - 1 })
        }
    },
    indexOfLastItem: () => {
        const { currentPage, itemsPerPage } = get()
        return currentPage * itemsPerPage
    },
    indexOfFirstItem: () => {
        const { indexOfLastItem, itemsPerPage } = get()
        return indexOfLastItem() - itemsPerPage
    },
    goToNextPage: (data: any[]) => {
        const { getTotalPages, currentPage } = get()
        const totalPages = getTotalPages(data);
        if (currentPage < totalPages) {
            set({ currentPage: currentPage + 1 });  
        }
    },
    getCurrentData: (data: any[] | null) => {
        const { indexOfFirstItem, indexOfLastItem } = get()
        if (data) {
            return data.slice(indexOfFirstItem(), indexOfLastItem())
        }
        return null
    },
    getTotalPages: (data: any[]) => {
        const { itemsPerPage } = get()
        if (data.length > 0) {
            return Math.ceil(data.length / itemsPerPage)
        } else {
            return 1
        }
    },
    setCurrentPage: (num: number) => set({ currentPage: num }),
}))

export default useGlobalPaginationStore