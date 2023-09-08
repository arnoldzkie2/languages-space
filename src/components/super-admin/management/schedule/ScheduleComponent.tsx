
const ScheduleComponent = (schedule: any) => {

    const { time, client, reserved } = schedule.event.extendedProps

    return (
        <div className={`p-2 mx-2 my-0.5 w-full border hover:border-blue-600 ${reserved ? 'bg-blue-600 text-white' : 'bg-slate-200 text-gray-600'} cursor-pointer rounded-md flex items-center gap-2`}>
            <strong>{time}</strong> {client && client}
        </div>
    )
}

export default ScheduleComponent