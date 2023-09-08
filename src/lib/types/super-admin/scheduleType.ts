interface SupplierSchedule {
    id: string
    suplier_id: string
    client_id: string | null
    client_name: string | null
    client_card_id: string | null
    date: string
    time: string
    reserved: boolean
    meeting_info: {
        service: string
        meeting_code: string
    } | {}
    note: string | null
    completed: boolean
}

export type { SupplierSchedule }
