interface TotalNews {
    total: string
    searched: string
    selected: string
}

interface News {
    id: string;
    title: string;
    author: string;
    content: string;
    created_at: string;
    updated_at: string;
    keywords: string[]
}

export type { News, TotalNews }