'use client'
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
        } className={`p-2 mx-2 my-0.5 w-full border hover:border-primary 
        ${status === 'reserved' ? 'bg-primary text-secondary' :
                status === 'canceled' ? ' bg-destructive text-foreground' :
                    'bg-secondary text-muted-foreground'} cursor-pointer rounded-md flex items-center gap-2`}>
            <strong>{time}</strong> {clientUsername || ''}
        </div >
    )
}

export default ScheduleComponent