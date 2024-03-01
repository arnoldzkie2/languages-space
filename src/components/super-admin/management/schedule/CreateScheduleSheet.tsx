'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Departments from '../Departments'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/utils'
import MultipleDatePicker from 'react-multi-date-picker'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import SubmitButton from '@/components/global/SubmitButton'
import Err from '@/components/global/Err'

const CreateScheduleSheet = () => {

    const { handleSelectAllTimeSlot, generateTimeSlots, createSchedule, timeSlots, setTimeSlots,
        minIntervals, handleSelectedDateChange, areAllTimeSlotSelected, selectedInterval, setSelectedInterval,
        handleTimeSlotChange, selectedDates, setSelectedDates
    } = useAdminScheduleStore()
    const [openSupplier, setOpenSupplier] = useState(false)
    const [open, setOpen] = useState(false)
    const { bookingFormData, setBookingFormData } = useAdminBookingStore()

    const { supplierWithMeeting } = useAdminSupplierStore()

    const renderTimeSlots = (category: string) => {
        return (
            <div key={category} className='flex text-muted-foreground flex-col gap-2'>
                <div className='flex items-center gap-1'>
                    <h3 className='font-medium mr-2 uppercase'>{category} time</h3>
                    <Checkbox
                        checked={areAllTimeSlotSelected(category)}
                        onCheckedChange={() => handleSelectAllTimeSlot(category)}
                        id={category}
                    />
                    <Label htmlFor={category} className='cursor-pointer'>Select all</Label>
                </div>

                <div className='flex gap-3 flex-wrap'>
                    {timeSlots[category].map((time: string) => (
                        <Button key={time}
                            onClick={() => handleTimeSlotChange(time)}
                            variant={selectedDates.times.includes(time) ? 'default' : 'secondary'}
                            className='border-0'
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            </div>
        );
    };

    useEffect(() => {
        const newTimeSlots = generateTimeSlots(selectedInterval);
        setTimeSlots(newTimeSlots);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInterval])

    useEffect(() => {
        setSelectedDates({ dates: [], times: [] })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const t = useTranslations()
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <div className='text-muted-foreground cursor-pointer hover:text-primary'>{t('schedule.create')}</div>
            </SheetTrigger>
            <SheetContent className='min-w-[450px] overflow-y-auto'>
                <SheetHeader className='pt-7'>
                    <SheetTitle className='flex items-center gap-10'>
                        <div className='w-full flex flex-col gap-3'>
                            <Departments />
                            <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openSupplier}
                                        className={cn(
                                            "w-full justify-between",
                                            !bookingFormData.supplierID && "text-muted-foreground"
                                        )}
                                    >
                                        {bookingFormData.supplierID
                                            ? supplierWithMeeting.find((supplier) => supplier.id === bookingFormData.supplierID)?.name
                                            : t('supplier.select.h1')}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder={t('supplier.search')}
                                            className="h-9"
                                        />
                                        <CommandEmpty>{t('supplier.404')}</CommandEmpty>
                                        <CommandGroup>
                                            {supplierWithMeeting.length > 0 ? supplierWithMeeting.map(supplier => (
                                                <CommandItem
                                                    key={supplier.id}
                                                    className={`${bookingFormData.supplierID === supplier.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    value={supplier.name}
                                                    onSelect={() => {
                                                        setBookingFormData({ ...bookingFormData, supplierID: supplier.id })
                                                        setOpenSupplier(false)
                                                    }}
                                                >
                                                    {supplier.name}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            bookingFormData.supplierID === supplier.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            )) : <CommandItem>{t('supplier.404')}</CommandItem>}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <MultipleDatePicker
                                value={selectedDates.dates}
                                onChange={handleSelectedDateChange}
                                format="YYYY-MM-DD"
                                placeholder='Select Date'
                                style={{
                                    width: '100%',
                                    height: '30px',
                                    background: 'none',
                                    fontSize: '14px',
                                    paddingLeft: '12px',
                                    fontWeight: 'normal',
                                    borderRadius: '3px',
                                }}
                            />
                        </div>
                        <ul className='flex w-full flex-col gap-3'>
                            {minIntervals.map(interval => (
                                <Button key={interval}
                                    onClick={() => setSelectedInterval(interval)}
                                    className='w-full'
                                    variant={selectedInterval === interval ? 'default' : 'outline'}
                                >{interval} Minutes</Button>
                            ))}
                        </ul>
                    </SheetTitle>
                </SheetHeader>
                <SheetDescription>
                    <div className='flex flex-col w-full gap-6 pt-10'>
                        {Object.keys(timeSlots).map((category) => renderTimeSlots(category))}
                    </div>
                </SheetDescription>
                <div className='my-10'>
                    <Err />
                </div>
                <SheetFooter className='w-full flex items-center gap-5'>
                    <SheetClose asChild>
                        <Button variant={'ghost'} className='w-full' onClick={() => setOpen(false)}>{t('operation.close')}</Button>
                    </SheetClose>
                    <form onSubmit={(e) => {
                        createSchedule(e, bookingFormData.supplierID, setOpen)
                    }} className='w-full'>
                        <SubmitButton msg={t('operation.create')} style='w-full' />
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CreateScheduleSheet