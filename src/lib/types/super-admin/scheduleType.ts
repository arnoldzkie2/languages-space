interface SupplierSchedule {
    id: string
    supplier_id: string
    client_id: string | null
    client_name: string | null
    client_card_id: string | null
    date: string
    time: string
    reserved: boolean
    meeting_info: {
        id: string
        service: string
        meeting_code: string
    } | null
    note: string | null
    completed: boolean
}

export type { SupplierSchedule }
