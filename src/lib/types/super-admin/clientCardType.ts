interface ClientCard {
    id: string
    name: string
    price: number
    balance: number
    validity: string
    invoice: boolean
    repeat_purchases: boolean
    online_purchases: boolean
    online_renews: boolean
    settlement_period: string
    date: string
}

export type { ClientCard }