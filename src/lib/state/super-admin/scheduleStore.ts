import { SupplierSchedule } from '@/lib/types/super-admin/scheduleType';
import axios from 'axios';
import { create } from 'zustand'
import useAdminBookingStore from './bookingStore';
import useGlobalStore from '../globalStore';

interface TimeSlot {
    [key: string]: string[]
}

interface ScheduleProps {
    minIntervals: number[]
    selectedInterval: number
    schedules: SupplierSchedule[]
    newSchedule: boolean
    toggleSchedule: () => void
    currentDate: {
        fromDate: string
        toDate: string
    }
    setCurrentDate: (date: {
        fromDate: string;
        toDate: string;
    }) => void
    getSchedule: (supplierID: string, fromDate: string, toDate: string) => Promise<void>
    bindSchedule: boolean
    closeBindSchedule: () => void
    bookingID: string | null
    openViewBooking: (booking: string) => void
    openBindSchedule: (scheduleID: string) => void
    closeViewBooking: () => void
    viewBooking: boolean
    timeSlots: TimeSlot
    setTimeSlots: (slot: TimeSlot) => void
    generateTimeSlots: (interval: number) => TimeSlot
    selectedDates: {
        dates: string[];
        times: string[];
    }
    setSelectedDates: (data: {
        dates: string[];
        times: string[];
    }) => void
    setSelectedInterval: (interval: number) => void
    handleSelectAllTimeSlot: (category: string) => void
    createSchedule: (e: React.MouseEvent, supplierID: string) => Promise<void>
    handleTimeSlotChange: (time: string) => void
    areAllTimeSlotSelected: (category: string) => boolean
    deleteSupplierSchedule: (e: React.MouseEvent, scheduleID: string) => Promise<void>
    handleSelectedDateChange: (newSelectedDates: any) => void
    setSchedules: (schedules: SupplierSchedule[]) => void
}

const useAdminScheduleStore = create<ScheduleProps>((set, get) => ({
    selectedInterval: 30,
    setSelectedInterval: (interval: number) => set({ selectedInterval: interval }),
    minIntervals: [5, 10, 30],
    selectedDates: { dates: [], times: [] },
    setSelectedDates: (data: {
        dates: string[];
        times: string[];
    }) => set({ selectedDates: data }),
    currentDate: {
        fromDate: '',
        toDate: ''
    },
    setCurrentDate: (date: { fromDate: string, toDate: string }) => set({ currentDate: date }),
    schedules: [],
    setSchedules: (schedules: SupplierSchedule[]) => set({ schedules }),
    getSchedule: async (supplierID: string, fromDate: string, toDate: string) => {
        try {
            const { data } = await axios.get(`/api/schedule/date`, {
                params: {
                    supplierID, fromDate, toDate
                }
            })
            if (data.ok) set({ schedules: data.data })

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg === 'Date not found') {
                return window.location.reload()
            }
            alert("Something went wrong")
        }
    },
    newSchedule: false,
    toggleSchedule: () => set(state => ({ newSchedule: !state.newSchedule })),
    bindSchedule: false,
    viewBooking: false,
    bookingID: null,
    openViewBooking: (bookingID: string) => set({ viewBooking: true, bookingID }),
    closeViewBooking: () => set({ viewBooking: false, bookingID: null }),
    openBindSchedule: (scheduleID: string) => {

        const { setBookingFormData, bookingFormData } = useAdminBookingStore.getState()

        setBookingFormData({ ...bookingFormData, scheduleID })
        set({ bindSchedule: true })
    },
    deleteSupplierSchedule: async (e: React.MouseEvent, scheduleID: string) => {
        e.preventDefault()

        const { schedules, setSchedules, closeBindSchedule } = get()
        const { setOkMsg, setIsLoading } = useGlobalStore.getState()

        try {


            setOkMsg('Deleting schedule...')
            setIsLoading(true)
            const { data } = await axios.delete('/api/schedule', { params: { scheduleID } })

            if (data.ok) {
                const filterSChedule = schedules.filter(sched => sched.id !== scheduleID)
                setSchedules(filterSChedule)
                setIsLoading(false)
                closeBindSchedule()
                setOkMsg('Success')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return alert(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    closeBindSchedule: () => {
        set({ bindSchedule: false })
    },
    generateTimeSlots: (interval: number): TimeSlot => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 60 / interval }, (_, i) => i * interval);

        const formatTime = (h: number, m: number): string => {
            const formattedHour = h.toString().padStart(2, '0');
            const formattedMinute = m.toString().padStart(2, '0');
            return `${formattedHour}:${formattedMinute}`;
        };

        const timeSlots: TimeSlot = {
            morning: [],
            afternoon: [],
            evening: [],
            midnight: [],
        };

        hours.forEach((hour) => {
            minutes.forEach((minute) => {
                const time = formatTime(hour, minute);
                if (hour < 6 || (hour === 6 && minute === 0)) {
                    timeSlots.midnight.push(time);
                } else if (hour < 12) {
                    timeSlots.morning.push(time);
                } else if (hour < 18) {
                    timeSlots.afternoon.push(time);
                } else if (hour < 24) {
                    timeSlots.evening.push(time);
                }
            });
        });
        return timeSlots;
    },
    handleSelectAllTimeSlot: (category: string) => {

        const { selectedDates, timeSlots } = get()
        const selectedTimes = selectedDates.times;
        const categoryTimes = timeSlots[category];

        const allSelected = categoryTimes.every((time: string) =>
            selectedTimes.includes(time)
        );

        const updatedTimes = allSelected
            ? selectedTimes.filter((time) => !categoryTimes.includes(time))
            : selectedTimes.concat(categoryTimes);

        set({ selectedDates: { ...selectedDates, times: updatedTimes } })
    },
    timeSlots: {},
    setTimeSlots: (slot: TimeSlot) => set({ timeSlots: slot }),
    createSchedule: async (e: React.MouseEvent, supplierID: string) => {

        const { selectedDates, getSchedule, toggleSchedule, currentDate } = get()
        const { setErr, setIsLoading } = useGlobalStore.getState()

        e.preventDefault()
        if (selectedDates.dates.length < 1) return setErr('Select atleast 1 date')
        if (selectedDates.times.length < 1) return setErr('Select atleast 1 timeslot')

        try {

            setIsLoading(true)
            const { data } = await axios.post(`/api/schedule`, {
                times: selectedDates.times,
                dates: selectedDates.dates,
                supplierID
            })

            if (data.ok) {
                getSchedule(supplierID, currentDate.fromDate, currentDate.toDate)
                setIsLoading(false)
                set({ selectedDates: { dates: [], times: [] } })
                toggleSchedule()
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    handleTimeSlotChange: (time: string) => {

        const { selectedDates, setSelectedDates } = get()

        const times = selectedDates.times.includes(time)
            ? selectedDates.times.filter((t) => t !== time)
            : [...selectedDates.times, time];

        setSelectedDates({ ...selectedDates, times });
    },
    areAllTimeSlotSelected: (category: string) => {
        const { timeSlots, selectedDates } = get()
        const categoryTimes = timeSlots[category];
        return categoryTimes.every((time: string) => selectedDates.times.includes(time));
    },
    handleSelectedDateChange: (newSelectedDates: any) => {

        const { setSelectedDates, selectedDates } = get()

        const formattedDates = newSelectedDates && newSelectedDates.length > 0 && newSelectedDates.map((timestamp: any) => {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });
        setSelectedDates({ ...selectedDates, dates: formattedDates || [] })

    }
}))

export default useAdminScheduleStore