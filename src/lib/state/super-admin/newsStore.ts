import { News, TotalNews } from '@/lib/types/super-admin/newsType'
import { create } from 'zustand'

const ManageWebSearchQueryValue = {
    title: '',
    author: '',
    content: '',
    keywords: '',
    date: ''
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
    date: ''
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
}

const useAdminNewsStore = create<NewsProps>((set) => ({
    totalNews: totalNewsValue,
    news: [],
    selectedNews: [],
    deleteNewsWarning: false,
    newsData: newsValue,
    setTotalNews: (total: TotalNews) => set({ totalNews: total }),
    setNews: (news: News[]) => set({ news: news }),
    setSelectedNews: (news: News[]) => set({ selectedNews: news }),
    openNewsDeleteWarning: (news: News) => set({ newsData: news, deleteNewsWarning: true }),
    closeNewsDeleteWarning: () => set({ deleteNewsWarning: false, newsData: newsValue })
}))

export default useAdminNewsStore