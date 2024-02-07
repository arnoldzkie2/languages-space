import { ClientCardList, Department, SupplierBalance, SupplierPrice } from "@prisma/client";
import { CONFIRMED, FINGERPOWER } from "./constants";

interface CommissionAndBookingPrice {
    department: Department
    clientQuantity: number;
    card: ClientCardList
    supplierQuantity: number;
    supplierPrice: SupplierPrice
    balance: SupplierBalance[]
    settlement: string
    status: string
}

const calculateCommissionPriceQuantitySettlementAndStatus = (props: CommissionAndBookingPrice) => {

    const { department, clientQuantity, card, supplierPrice, supplierQuantity, balance, settlement, status } = props

    const today = new Date().toISOString().split('T')[0]
    const isFingerPower = department.name.toLocaleLowerCase() === FINGERPOWER;

    // Calculate booking price
    const bookingPrice = isFingerPower
        ? Number(clientQuantity) * Number(card.price)
        : (Number(card.price) / card.balance) * Number(supplierPrice.price);

    // Calculate supplier commission
    const supplierCommission = isFingerPower
        ? supplierQuantity * Number(supplierPrice.price)
        : balance[0].booking_rate;

    // Calculate booking quantity
    const bookingQuantity = isFingerPower
        ? { client: Number(clientQuantity || 0), supplier: Number(supplierQuantity || 0) }
        : { client: 1, supplier: 1 };

    const getStatus = isFingerPower
        ? status
        : CONFIRMED

    // Determine settlement date
    const settlementDate = isFingerPower ? settlement : today;

    return {
        bookingPrice,
        supplierCommission,
        bookingQuantity,
        settlementDate,
        getStatus
    };
}

export { calculateCommissionPriceQuantitySettlementAndStatus }