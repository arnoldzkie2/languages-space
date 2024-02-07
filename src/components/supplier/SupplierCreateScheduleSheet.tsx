'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import MultipleDatePicker from 'react-multi-date-picker'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import SubmitButton from '@/components/global/SubmitButton'
import Err from '@/components/global/Err'
import useSupplierStore from '@/lib/state/supplier/supplierStore'

const SupplierCreateScheduleSheet = () => {

    const { handleSelectAllTimeSlot, generateTimeSlots, createSchedule, timeSlots, setTimeSlots,
        minIntervals, handleSelectedDateChange, areAllTimeSlotSelected, selectedInterval, setSelectedInterval,
        handleTimeSlotChange, selectedDates, setSelectedDates
    } = useAdminScheduleStore()
    const [open, setOpen] = useState(false)
    const { supplier } = useSupplierStore()

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
    const t = useTranslations('super-admin')
    const tt = useTranslations("global")
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>{t('schedule.create')}</Button>
            </SheetTrigger>
            <SheetContent className='min-w-[500px] overflow-y-auto'>
                <SheetHeader className='pt-7'>
                    <SheetTitle className='flex items-center flex-col gap-5'>
                        <ul className='flex w-full gap-3'>
                            {minIntervals.map(interval => (
                                <Button key={interval}
                                    onClick={() => setSelectedInterval(interval)}
                                    className='w-full'
                                    variant={selectedInterval === interval ? 'default' : 'outline'}
                                >{interval} Minutes</Button>
                            ))}
                        </ul>
                        <div className='w-1/2 flex flex-col gap-3'>
                            <MultipleDatePicker
                                value={selectedDates.dates || null}
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
                        <Button variant={'ghost'} className='w-full' onClick={() => setOpen(false)}>{tt('close')}</Button>
                    </SheetClose>
                    <form onSubmit={(e) => {
                        createSchedule(e, supplier?.id || '', setOpen)
                    }} className='w-full'>
                        <SubmitButton msg={tt('create')} style='w-full' />
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default SupplierCreateScheduleSheet