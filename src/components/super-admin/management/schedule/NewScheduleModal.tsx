/* eslint-disable react-hooks/exhaustive-deps */
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Departments from '../Departments'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { useTranslations } from 'next-intl'
import MultipleDatePicker from 'react-multi-date-picker'
import useAdminGlobalStore from '@/lib/state/super-admin/globalStore'
import Err from '@/components/global/Err'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'

interface TimeSlot {
    [key: string]: string[]
}



const NewScheduleModal = () => {

    const [searchQuery, setSearchQuery] = useState('')

    const { isLoading, skeleton } = useAdminGlobalStore()

    const { handleSelectAllTimeSlot, generateTimeSlots, createSchedule, timeSlots, setTimeSlots,
        minIntervals, handleSelectedDateChange, areAllTimeSlotSelected, selectedInterval, setSelectedInterval,
        toggleSchedule, handleTimeSlotChange, selectedDates, setSelectedDates
    } = useAdminScheduleStore()

    const { bookingFormData, setBookingFormData } = useAdminBookingStore()

    const { supplier } = useAdminSupplierStore()

    const filterSupplier = supplier.filter(supplier => supplier.name.toUpperCase().includes(searchQuery.toUpperCase())).slice(0, 20)

    const renderTimeSlots = (category: string) => {
        return (
            <div key={category} className='flex text-gray-600 flex-col gap-2'>
                <div className='flex items-center gap-1'>
                    <h3 className='font-medium mr-2'>{category} time</h3>
                    <input
                        type="checkbox"
                        checked={areAllTimeSlotSelected(category)}
                        onChange={() => handleSelectAllTimeSlot(category)}
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

    useEffect(() => {
        const newTimeSlots = generateTimeSlots(selectedInterval);
        setTimeSlots(newTimeSlots);
    }, [selectedInterval])

    useEffect(() => {
        setSelectedDates({ dates: [], times: [] })
    }, [])
    const t = useTranslations('super-admin')

    return (
        <div className='fixed top-0 left-0 w-screen z-20 h-screen flex bg-opacity-50 bg-gray-600'>
            <div className='w-full h-full cursor-pointer' onClick={toggleSchedule}>
            </div>
            <div className='bg-white p-10 shadow-lg flex gap-10 overflow-y-auto w-full h-full relative'>
                <FontAwesomeIcon onClick={toggleSchedule} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <div className='flex flex-col gap-4'>
                    <Err />
                    <Departments />
                    <MultipleDatePicker
                        value={selectedDates.dates}
                        onChange={handleSelectedDateChange}
                        format="YYYY-MM-DD"
                        placeholder='Select Date'
                        style={{ height: '40px', width: '100%' }}
                    />
                    <input value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} type="text" className='border outline-none py-1.5 px-3' placeholder={t('supplier.search')} />
                    <ul className='flex flex-col h-full pr-2 gap-3 overflow-y-auto py-2 text-gray-600'>
                        {filterSupplier.length > 0 ? filterSupplier.map(supplier => (
                            <li onClick={() => setBookingFormData({ ...bookingFormData, supplierID: supplier.id })} className={`${bookingFormData.supplierID === supplier.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-blue-600 hover:text-white'} rounded-md w-full py-1.5 cursor-pointer px-2`} key={supplier.id}>{supplier.name}</li>
                        )) : skeleton.map(supplier => (
                            <li key={supplier} className='bg-slate-200 animate-pulse h-7 rounded-xl w-full'></li>
                        ))}
                    </ul>
                    <button disabled={isLoading} onClick={(e: any) => createSchedule(e, bookingFormData?.supplierID)} className={`${isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'} w-full flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Create'}</button>
                </div>
                <div className='w-full'>
                    <ul className='flex items-center gap-5 mb-5'>
                        {minIntervals.map(interval => (
                            <li key={interval} onClick={() => setSelectedInterval(interval)} className={`${selectedInterval === interval ? 'bg-blue-600 text-white' : 'bg-white'} border px-5 py-2 rounded-md cursor-pointer`}>{interval} Minutes</li>
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

