export interface totalNewsState {
    total: string
    searched: string
    selected: string
}

export interface allNewsState {
    id: string;
    title: string;
    author: string;
    content: string;
    date: string;
    keywords: string[]
}

export interface ManageWebState {

    totalNews: totalNewsState
    news: allNewsState[]
    selectedNews: allNewsState[]
    newsSelectedID: string
    operation: boolean
    deleteWarning: boolean
    targetNews: allNewsState
}

