import { SupplierSchedule } from "@/lib/types/super-admin/scheduleType"

interface Props {
    event: {
        extendedProps: {
            data: SupplierSchedule;
            viewBooking: (booking: string) => void;
            openBindSchedule: (schedileID: string) => void;
        }
    }
}

const ScheduleComponent: React.FC<Props> = (schedule) => {

    const { time, clientUsername, status, id: scheduleID } = schedule.event.extendedProps.data

    const booking = schedule.event.extendedProps.data.booking
    const viewBooking = schedule.event.extendedProps.viewBooking
    const bindSchedule = schedule.event.extendedProps.openBindSchedule

    return (
        <div onClick={() => status === 'available' ? bindSchedule(scheduleID) : viewBooking(booking![0].id)
        } className={`p-2 mx-2 my-0.5 w-full border hover:border-blue-600 
        ${status === 'reserved' ? 'bg-blue-600 text-white' :
                status === 'canceled' ? 'bg-orange-400 text-white' :
                    'bg-slate-200 text-gray-600'} cursor-pointer rounded-md flex items-center gap-2`}>
            <strong>{time}</strong> {clientUsername || ''}
        </div >
    )
}

export default ScheduleComponent