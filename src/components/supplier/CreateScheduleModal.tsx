/* eslint-disable react-hooks/exhaustive-deps */
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import MultipleDatePicker from 'react-multi-date-picker'
import Err from '@/components/global/Err'
import useSupplierStore from '@/lib/state/supplier/supplierStore'
import useGlobalStore from '@/lib/state/globalStore'

const CreateScheduleModal = () => {

    const { isLoading } = useGlobalStore()
    const { supplier } = useSupplierStore()
    const { generateTimeSlots, selectedDates, setSelectedDates,
        toggleSchedule, minIntervals, selectedInterval, setSelectedInterval, timeSlots,
        setTimeSlots, handleSelectAllTimeSlot, createSchedule, handleTimeSlotChange,
        areAllTimeSlotSelected, handleSelectedDateChange } = useAdminScheduleStore()

    const renderTimeSlots = (category: string) => {
        return (
            <div key={category} className='flex text-gray-600 flex-col gap-2'>
                <div className='flex items-center gap-1'>
                    <h3 className='font-medium mr-2'>{category} time</h3>
                    <input
                        type="checkbox"
                        className='cursor-pointer'
                        checked={areAllTimeSlotSelected(category)}
                        onChange={() => handleSelectAllTimeSlot(category)}
                        id={category}
                    />
                    <label htmlFor={category} className='text-sm cursor-pointer'>{t('client-card.select-all')}</label>
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
                <div className='w-full'>
                    <Err />
                    <ul className='flex items-center gap-5 mb-5 w-full'>
                        {minIntervals.map(interval => (
                            <li key={interval} onClick={() => setSelectedInterval(interval)} className={`${selectedInterval === interval ? 'bg-blue-600 text-white' : 'bg-white'} border px-5 py-2 rounded-md cursor-pointer`}>{interval} Minutes</li>
                        ))}
                        <div className='relative'>
                            <FontAwesomeIcon icon={faXmark} width={16} height={16} onClick={() => setSelectedDates({ ...selectedDates, dates: [] })} className={`absolute right-1 bg-white p-2 hover:text-red-600 cursor-pointer top-1 ${selectedDates.dates.length > 0 ? 'block' : 'hidden'}`} />
                            <MultipleDatePicker
                                value={selectedDates.dates}
                                onChange={handleSelectedDateChange}
                                format="YYYY-MM-DD"
                                placeholder='Select Date'
                                style={{ height: '40px' }}
                            />
                        </div>
                        <button disabled={isLoading} onClick={(e) => createSchedule(e, supplier?.id!)} className={`${isLoading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-400'} px-6 self-end flex items-center justify-center py-2 rounded-md text-white`}>{isLoading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Create'}</button>
                    </ul>
                    <div className='flex flex-col w-full gap-6 overflow-y-auto h-full pb-10'>
                        {Object.keys(timeSlots).map((category) => renderTimeSlots(category))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateScheduleModal

