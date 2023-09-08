interface Department {
    id: string,
    name: string,
    date: string
}

interface TotalProps {
    total: string;
    searched: string;
    selected: string;
}

export type { Department, TotalProps }