import { Supplier, SupplierBalanceTransactions } from "@prisma/client";

interface SupplierBalanceTransaction extends SupplierBalanceTransactions {
    balance: {
        supplier: {
            name: string
        }
    }
}

export type { SupplierBalanceTransaction }