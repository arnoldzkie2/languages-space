import { News, TotalNews } from '@/lib/types/super-admin/newsType'
import axios from 'axios'
import { create } from 'zustand'
import useDepartmentStore from './departmentStore'

const ManageWebSearchQueryValue = {
    title: '',
    author: '',
    content: '',
    keywords: '',
    created_at: '',
    updated_at: ''
}

const totalNewsValue = {
    total: '',
    searched: '',
    selected: ''
}

const newsValue = {
    id: '',
    title: '',
    author: '',
    content: '',
    keywords: [],
    created_at: '',
    updated_at: ''
}

export { ManageWebSearchQueryValue, totalNewsValue, newsValue }

interface NewsProps {
    totalNews: TotalNews
    news: News[]
    selectedNews: News[]
    deleteNewsWarning: boolean
    newsData: News
    setTotalNews: (total: TotalNews) => void
    setNews: (news: News[]) => void
    setSelectedNews: (news: News[]) => void
    openNewsDeleteWarning: (news: News) => void
    closeNewsDeleteWarning: () => void
    getNews: () => Promise<void>
}

const useAdminNewsStore = create<NewsProps>((set) => ({
    totalNews: totalNewsValue,
    news: [],
    selectedNews: [],
    deleteNewsWarning: false,
    newsToPublish: 1,
    newsData: newsValue,
    setTotalNews: (total: TotalNews) => set({ totalNews: total }),
    setNews: (news: News[]) => set({ news: news }),
    setSelectedNews: (news: News[]) => set({ selectedNews: news }),
    openNewsDeleteWarning: (news: News) => set({ newsData: news, deleteNewsWarning: true }),
    closeNewsDeleteWarning: () => set({ deleteNewsWarning: false, newsData: newsValue }),
    getNews: async () => {

        const departmentID = useDepartmentStore.getState().departmentID
        try {
            const { data } = await axios.get(`/api/news`, {
                params: {
                    departmentID: departmentID || null
                }
            })
            if (data.ok) {
                set({ news: data.data })
            }

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }
}))

export default useAdminNewsStore