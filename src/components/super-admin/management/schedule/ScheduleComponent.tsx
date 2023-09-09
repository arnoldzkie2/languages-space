import { SupplierSchedule } from "@/lib/types/super-admin/scheduleType"

interface Props {
    event: {
        extendedProps: {
            data: SupplierSchedule
            viewSchedule: (scheduleData: SupplierSchedule) => void
        }
    }
}

const ScheduleComponent: React.FC<Props> = (schedule) => {

    const { time, client_name, reserved } = schedule.event.extendedProps.data

    return (
        <div onClick={() => schedule.event.extendedProps.viewSchedule(schedule.event.extendedProps.data)} className={`p-2 mx-2 my-0.5 w-full border hover:border-blue-600 ${reserved ? 'bg-blue-600 text-white' : 'bg-slate-200 text-gray-600'} cursor-pointer rounded-md flex items-center gap-2`}>
            <strong>{time}</strong> {client_name && client_name}
        </div>
    )
}

export default ScheduleComponent