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
    date: string;
    keywords: string[]
}

export type { News, TotalNews }