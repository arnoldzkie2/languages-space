interface Department {
    id: string,
    name: string,
    created_at: string
    updated_at: string
}

interface TotalProps {
    total: string;
    searched: string;
    selected: string;
}

export type { Department, TotalProps }