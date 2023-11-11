import { SupplierSchedule } from "@/lib/types/super-admin/scheduleType"

interface Props {
    event: {
        extendedProps: {
            data: SupplierSchedule;
            viewBooking: (booking: string) => void;
            openBindSchedule: (schedule: SupplierSchedule) => void;
        }
    }
}

const ScheduleComponent: React.FC<Props> = (schedule) => {

    const { time, clientName, status } = schedule.event.extendedProps.data

    const bookingID = schedule.event.extendedProps.data.bookingID
    const scheduleData = schedule.event.extendedProps.data
    const viewBooking = schedule.event.extendedProps.viewBooking
    const bindSchedule = schedule.event.extendedProps.openBindSchedule

    return (
        <div onClick={() => status === 'reserved' ? viewBooking(bookingID || '') : bindSchedule(scheduleData)} className={`p-2 mx-2 my-0.5 w-full border hover:border-blue-600 ${status === 'reserved' ? 'bg-blue-600 text-white' : status === 'available' ? 'bg-slate-200 text-gray-600' : 'bg-orange-500'} cursor-pointer rounded-md flex items-center gap-2`}>
            <strong>{time}</strong> {clientName && clientName}
        </div>
    )
}

export default ScheduleComponent