import { SupplierSchedule } from "@/lib/types/super-admin/scheduleType"
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    event: {
        extendedProps: {
            data: SupplierSchedule;
            viewBooking: (ID: string) => void
            deleteSupplierSchedule: (e: React.MouseEvent, scheduleID: string) => void;
            isLoading: boolean
        }
    }
}

const ScheduleComponent: React.FC<Props> = (schedule) => {

    const { time, clientUsername, status, id: scheduleID } = schedule.event.extendedProps.data
    const booking = schedule.event.extendedProps.data.booking
    const { deleteSupplierSchedule, viewBooking } = schedule.event.extendedProps
    const isLoading = schedule.event.extendedProps.isLoading

    return (
        <button disabled={isLoading} title={status === 'reserved' ? 'View Booking' : 'Delete Schedule'}
            onClick={(e) => status === 'available' ? deleteSupplierSchedule(e, scheduleID) : viewBooking(booking![0].id)
            } className={`p-2 mx-2 my-0.5 relative w-full border 
            ${status === 'reserved' ? 'bg-blue-600 text-white' :
                    status === 'canceled' ? 'bg-orange-400 text-white' : 'bg-slate-100 text-gray-600 hover:text-red-500 hover:border-red-500'} cursor-pointer rounded-md flex items-center gap-2`}>
            <strong>{time}</strong> {clientUsername || ''}
            <FontAwesomeIcon icon={faXmark} width={16} height={16} className="absolute right-3 top-3" />
        </button >
    )
}

export default ScheduleComponent