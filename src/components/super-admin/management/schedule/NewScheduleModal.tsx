import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Departments from '../Departments'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { useTranslations } from 'next-intl'
import MultipleDatePicker from 'react-multi-date-picker'
import axios from 'axios'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'

interface TimeSlot {
    [key: string]: string[]
}



const NewScheduleModal = () => {

    const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const [searchQuery, setSearchQuery] = useState('')

    const [selectedDates, setSelectedDates] = useState<{ dates: string[], times: string[] }>({
        dates: [],
        times: []
    });

    const { isLoading, setIsLoading } = useAdminGlobalStore()

    const { getSchedule, currentDate } = useAdminScheduleStore()

    const { supplier, supplierSelectedID, setSupplierSelectedID } = useAdminSupplierStore()

    const filterSupplier = supplier.filter(item => item.name.toUpperCase().includes(searchQuery.toUpperCase()))

    const addSchedule = async (e: any) => {

        e.preventDefault()
        if (!supplierSelectedID) return alert('Select a supplier')
        if (selectedDates.dates.length < 1) return alert('Select atleast 1 date')
        if (selectedDates.times.length < 1) return alert('Select atleast 1 timeslot')

        try {

            setIsLoading(true)

            const { data } = await axios.post(`/api/schedule`, {
                supplierID: supplierSelectedID,
                times: selectedDates.times,
                dates: selectedDates.dates
            })

            if (data.ok) {
                setIsLoading(false)
                setSelectedDates({ dates: [], times: [] })
                toggleSchedule()
                getSchedule(supplierSelectedID, currentDate.fromDate, currentDate.toDate)
            }

        } catch (error) {
            setIsLoading(false)
            console.log(error);

            alert('Something went wrong')

        }
    }

    const { toggleSchedule } = useAdminScheduleStore()

    const [intervals, setIntervals] = useState([5, 10, 30])

    const [selectedInterval, setSelectedInterval] = useState(30)

    const [timeSlots, setTimeSlots] = useState<TimeSlot>({
        morning: [
            '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        ],
        afternoon: [
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        ],
        evening: [
            '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
            '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
        ],
        midnight: [
            '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
            '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
        ]
    })

    const handleTimeSlotChange = (time: string) => {
        const times = selectedDates.times.includes(time)
            ? selectedDates.times.filter((t) => t !== time)
            : [...selectedDates.times, time];

        setSelectedDates((prevData) => ({ ...prevData, times }));
    };

    const handleSelectAll = (category: string) => {
        setSelectedDates((prevData) => {
            const selectedTimes = prevData.times;
            const categoryTimes = timeSlots[category]

            const allSelected = categoryTimes.every((time: string) =>
                selectedTimes.includes(time)
            );

            const updatedTimes = allSelected
                ? selectedTimes.filter((time) => !categoryTimes.includes(time))
                : selectedTimes.concat(categoryTimes);

            return { ...prevData, times: updatedTimes };
        });
    };

    const areAllSelected = (category: string) => {
        const categoryTimes = timeSlots[category];
        return categoryTimes.every((time: string) => selectedDates.times.includes(time));
    };

    const renderTimeSlots = (category: string) => {
        return (
            <div key={category} className='flex text-gray-600 flex-col gap-2'>
                <div className='flex items-center gap-1'>
                    <h3 className='font-medium mr-2'>{category} time</h3>
                    <input
                        type="checkbox"
                        checked={areAllSelected(category)}
                        onChange={() => handleSelectAll(category)}
                        id={category}
                    />
                    <label htmlFor={category}>Select all</label>
                </div>

                <div className='flex gap-3 flex-wrap'>
                    {timeSlots[category].map((time: string) => (
                        <label key={time} className={`flex gap-1 w-20 ${selectedDates.times.includes(time) ? 'border-blue-500' : 'border-gray-300'} items-center justify-center py-1.5 rounded-md cursor-pointer border`}>
                            <input
                                type="checkbox"
                                checked={selectedDates.times.includes(time)}
                                onChange={() => handleTimeSlotChange(time)}
                            />
                            {time}
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const handleDateChange = (newSelectedDates: any) => {

        const formattedDates = newSelectedDates && newSelectedDates.length > 0 && newSelectedDates.map((timestamp: any) => {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });

        setSelectedDates(prevData => ({ ...prevData, dates: formattedDates || [] }))

    };

    useEffect(() => {

        let newTimeSlots: TimeSlot = {}

        if (selectedInterval === 5) {
            newTimeSlots = {
                morning: [
                    '06:00', '06:05', '06:10', '06:15', '06:20', '06:25',
                    '06:30', '06:35', '06:40', '06:45', '06:50', '06:55',
                    '07:00', '07:05', '07:10', '07:15', '07:20', '07:25',
                    '07:30', '07:35', '07:40', '07:45', '07:50', '07:55',
                    '08:00', '08:05', '08:10', '08:15', '08:20', '08:25',
                    '08:30', '08:35', '08:40', '08:45', '08:50', '08:55',
                    '09:00', '09:05', '09:10', '09:15', '09:20', '09:25',
                    '09:30', '09:35', '09:40', '09:45', '09:50', '09:55',
                    '10:00', '10:05', '10:10', '10:15', '10:20', '10:25',
                    '10:30', '10:35', '10:40', '10:45', '10:50', '10:55',
                    '11:00', '11:05', '11:10', '11:15', '11:20', '11:25',
                    '11:30', '11:35', '11:40', '11:45', '11:50', '11:55',
                ],
                afternoon: [
                    '12:00', '12:05', '12:10', '12:15', '12:20', '12:25',
                    '12:30', '12:35', '12:40', '12:45', '12:50', '12:55',
                    '13:00', '13:05', '13:10', '13:15', '13:20', '13:25',
                    '13:30', '13:35', '13:40', '13:45', '13:50', '13:55',
                    '14:00', '14:05', '14:10', '14:15', '14:20', '14:25',
                    '14:30', '14:35', '14:40', '14:45', '14:50', '14:55',
                    '15:00', '15:05', '15:10', '15:15', '15:20', '15:25',
                    '15:30', '15:35', '15:40', '15:45', '15:50', '15:55',
                    '16:00', '16:05', '16:10', '16:15', '16:20', '16:25',
                    '16:30', '16:35', '16:40', '16:45', '16:50', '16:55',
                    '17:00', '17:05', '17:10', '17:15', '17:20', '17:25',
                    '17:30', '17:35', '17:40', '17:45', '17:50', '17:55',
                ],
                evening: [
                    '18:00', '18:05', '18:10', '18:15', '18:20', '18:25',
                    '18:30', '18:35', '18:40', '18:45', '18:50', '18:55',
                    '19:00', '19:05', '19:10', '19:15', '19:20', '19:25',
                    '19:30', '19:35', '19:40', '19:45', '19:50', '19:55',
                    '20:00', '20:05', '20:10', '20:15', '20:20', '20:25',
                    '20:30', '20:35', '20:40', '20:45', '20:50', '20:55',
                    '21:00', '21:05', '21:10', '21:15', '21:20', '21:25',
                    '21:30', '21:35', '21:40', '21:45', '21:50', '21:55',
                    '22:00', '22:05', '22:10', '22:15', '22:20', '22:25',
                    '22:30', '22:35', '22:40', '22:45', '22:50', '22:55',
                    '23:00', '23:05', '23:10', '23:15', '23:20', '23:25',
                    '23:30', '23:35', '23:40', '23:45', '23:50', '23:55',
                ],
                midnight: [
                    '00:00', '00:05', '00:10', '00:15', '00:20', '00:25',
                    '00:30', '00:35', '00:40', '00:45', '00:50', '00:55',
                    '01:00', '01:05', '01:10', '01:15', '01:20', '01:25',
                    '01:30', '01:35', '01:40', '01:45', '01:50', '01:55',
                    '02:00', '02:05', '02:10', '02:15', '02:20', '02:25',
                    '02:30', '02:35', '02:40', '02:45', '02:50', '02:55',
                    '03:00', '03:05', '03:10', '03:15', '03:20', '03:25',
                    '03:30', '03:35', '03:40', '03:45', '03:50', '03:55',
                    '04:00', '04:05', '04:10', '04:15', '04:20', '04:25',
                    '04:30', '04:35', '04:40', '04:45', '04:50', '04:55',
                    '05:00', '05:05', '05:10', '05:15', '05:20', '05:25',
                    '05:30', '05:35', '05:40', '05:45', '05:50', '05:55',
                ],
            };
        } else if (selectedInterval === 10) {
            newTimeSlots = {
                morning: [
                    '06:00', '06:10', '06:20', '06:30', '06:40', '06:50',
                    '07:00', '07:10', '07:20', '07:30', '07:40', '07:50',
                    '08:00', '08:10', '08:20', '08:30', '08:40', '08:50',
                    '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
                    '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
                    '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
                ],
                afternoon: [
                    '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
                    '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
                    '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
                    '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
                    '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
                    '17:00', '17:10', '17:20', '17:30', '17:40', '17:50',
                ],
                evening: [
                    '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
                    '19:00', '19:10', '19:20', '19:30', '19:40', '19:50',
                    '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
                    '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
                    '22:00', '22:10', '22:20', '22:30', '22:40', '22:50',
                    '23:00', '23:10', '23:20', '23:30', '23:40', '23:50',
                ],
                midnight: [
                    '00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
                    '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
                    '02:00', '02:10', '02:20', '02:30', '02:40', '02:50',
                    '03:00', '03:10', '03:20', '03:30', '03:40', '03:50',
                    '04:00', '04:10', '04:20', '04:30', '04:40', '04:50',
                    '05:00', '05:10', '05:20', '05:30', '05:40', '05:50',
                ],
            };
        } else if (selectedInterval === 30) {
            newTimeSlots = {
                morning: [
                    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
                    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                ],
                afternoon: [
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
                ],
                evening: [
                    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
                    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
                ],
                midnight: [
                    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
                    '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
                ],
            };
        }

        setTimeSlots(newTimeSlots);

    }, [selectedInterval]);

    const t = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen grid place-items-end bg-opacity-50 bg-gray-600'>
            <div className='bg-white p-10 shadow-lg flex gap-10 overflow-y-auto w-1/2 h-full relative'>
                <FontAwesomeIcon onClick={() => toggleSchedule()} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex flex-col gap-4'>
                    <Departments />
                    <MultipleDatePicker
                        value={selectedDates.dates}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                        placeholder='Select Date'
                        style={{ height: '40px', width: '100%' }}
                    />
                    <input value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} type="text" className='border outline-none py-1.5 px-3' placeholder={t('supplier.search')} />
                    <ul className='flex flex-col h-full pr-2 gap-3 overflow-y-auto py-2 text-gray-600'>
                        {filterSupplier.length > 0 ? filterSupplier.map(item => (
                            <li onClick={() => setSupplierSelectedID(item.id)} className={`${supplierSelectedID === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'} rounded-md w-full py-1.5 cursor-pointer px-2`} key={item.id}>{item.name} ({item.user_name})</li>
                        )) : skeleton.map(item => (
                            <li key={item} className='bg-slate-200 animate-pulse h-7 rounded-xl w-full'></li>
                        ))}
                    </ul>
                    <button disabled={isLoading} onClick={(e: any) => addSchedule(e)} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Create'}</button>
                </div>
                <div className='w-full'>
                    <ul className='flex items-center gap-5 mb-5'>
                        {intervals.map(item => (
                            <li key={item} onClick={() => setSelectedInterval(item)} className={`${selectedInterval === item ? 'bg-blue-600 text-white' : 'bg-white'} border px-5 py-2 rounded-md cursor-pointer`}>{item} Minutes</li>
                        ))}
                    </ul>
                    <div className='flex flex-col w-full gap-6 h-full overflow-y-auto'>
                        {Object.keys(timeSlots).map((category) => renderTimeSlots(category))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewScheduleModal

