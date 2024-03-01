/* eslint-disable react-hooks/exhaustive-deps */
import { faXmark, faSpinner, faS, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FormEvent, useEffect, useState } from 'react'
import Departments from '../Departments'
import { useTranslations } from 'next-intl'
import useAdminScheduleStore from '@/lib/state/super-admin/scheduleStore'
import useAdminClientStore from '@/lib/state/super-admin/clientStore'
import axios from 'axios'
import useAdminSupplierStore from '@/lib/state/super-admin/supplierStore'
import useAdminBookingStore from '@/lib/state/super-admin/bookingStore'
import Err from '@/components/global/Err'
import useGlobalStore from '@/lib/state/globalStore'
import { ADMIN, CONFIRMED } from '@/utils/constants'
import useDepartmentStore from '@/lib/state/super-admin/departmentStore'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format, isValid } from 'date-fns'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/global/SubmitButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const ScheduleBookingModal = () => {

    const { closeBindSchedule, getSchedule, currentDate, deleteSupplierSchedule } = useAdminScheduleStore()
    const { isLoading, setIsLoading, setErr } = useGlobalStore()
    const { clientWithCards, getClientsWithCards, clientCards, getClientCards } = useAdminClientStore()
    const { supplierMeetingInfo, getCardCourses, getSupplierMeetingInfo, cardCourses, clearCardCourses } = useAdminSupplierStore()
    const { bookingFormData, setBookingFormData, createBooking } = useAdminBookingStore()
    const departmentID = useDepartmentStore(s => s.departmentID)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingFormData({ ...bookingFormData, [name]: value })
    }

    const [openClient, setOpenClient] = useState(false)
    const [openCard, setOpenCard] = useState(false)
    const bookSchedule = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const { note, meetingInfoID, clientCardID, courseID, client_quantity, supplier_quantity, settlement, scheduleID, supplierID, clientID } = bookingFormData

        if (!meetingInfoID) return setErr('Select  meeting info')
        if (!clientCardID) return setErr('Select card')
        if (!clientID) return setErr('Select client')
        if (!courseID) return setErr('Select course')
        if (!settlement) return setErr('Settlement is requireqd')
        if (!supplierID || !scheduleID) return setErr('Please reload the page')
        if (!client_quantity) return setErr('Client quantity be greater than 0')
        if (!supplier_quantity) return setErr('Supplier quantity be greater than 0')

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking', {
                scheduleID, supplierID, clientID, clientCardID,
                meetingInfoID, note, settlement,
                name: "1v1 Class", operator: ADMIN,
                status: CONFIRMED,
                client_quantity: Number(client_quantity),
                supplier_quantity: Number(supplier_quantity),
                courseID
            })

            if (data.ok) {
                setIsLoading(false)
                closeBindSchedule()
                getSchedule(bookingFormData.supplierID, currentDate.fromDate, currentDate.toDate)
                toast("Success! booking created.")
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    }

    useEffect(() => {
        setBookingFormData({
            ...bookingFormData, clientID: '', clientCardID: '', courseID: ''
        })
        getClientsWithCards()
    }, [departmentID])

    useEffect(() => {
        if (bookingFormData.clientCardID) getCardCourses(bookingFormData.clientCardID)
    }, [bookingFormData.clientCardID])

    useEffect(() => {
        if (bookingFormData.supplierID) getSupplierMeetingInfo(bookingFormData.supplierID)
    }, [bookingFormData.supplierID])

    useEffect(() => {
        if (bookingFormData.clientID) {
            setBookingFormData({ ...bookingFormData, clientCardID: '', courseID: '' })
            clearCardCourses()
            getClientCards(bookingFormData.clientID)
        }
    }, [bookingFormData.clientID])

    const t = useTranslations()

    return (
        <div className='fixed top-0 left-0 w-screen z-50 flex h-screen'>

            <div className='w-full h-full backdrop-blur cursor-pointer' title={t('operation.close')} onClick={closeBindSchedule}>

            </div>
            <div className='bg-card shadow-lg flex gap-10 overflow-y-auto w-1/3 h-full relative'>
                <FontAwesomeIcon onClick={() => closeBindSchedule()} icon={faXmark} width={16} height={16} className='absolute text-xl top-6 right-6 cursor-pointer' />
                <Card>
                    <CardHeader>
                        <CardTitle>{t('booking.create')}</CardTitle>
                        <CardDescription><Err /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className='flex flex-col gap-4 w-full' onSubmit={bookSchedule}>
                            <Departments />
                            <div className='flex w-full flex-col gap-1.5'>
                                <Label>{t('side_nav.client')}</Label>
                                <Popover open={openClient} onOpenChange={setOpenClient}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openClient}
                                            className={cn(
                                                "w-full justify-between",
                                                !bookingFormData.clientID && "text-muted-foreground"
                                            )}
                                        >
                                            {bookingFormData.clientID
                                                ? clientWithCards.find((client) => client.id === bookingFormData.clientID)?.username
                                                : t('client.select.h1')}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder={t('client.search')}
                                                className="h-9"
                                            />
                                            <CommandEmpty>{t('client.404')}</CommandEmpty>
                                            <CommandGroup>
                                                {clientWithCards.length > 0 ? clientWithCards.map(client => (
                                                    <CommandItem
                                                        key={client.id}
                                                        className={`${bookingFormData.clientID === client.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                        value={client.username}
                                                        onSelect={() => {
                                                            setBookingFormData({ ...bookingFormData, clientID: client.id })
                                                            setOpenClient(false)
                                                        }}
                                                    >
                                                        {client.username}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                bookingFormData.clientID === client.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )) : <CommandItem>{t('client.404')}</CommandItem>}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className='flex w-full flex-col gap-1.5'>
                                <Label>{t('card.h1')}</Label>
                                <Popover open={openCard} onOpenChange={setOpenCard}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCard}
                                            className={cn(
                                                "w-full justify-between",
                                                !bookingFormData.clientCardID && "text-muted-foreground"
                                            )}
                                        >
                                            {bookingFormData.clientCardID
                                                ? clientCards.find((card) => card.id === bookingFormData.clientCardID)?.name
                                                : t('card.select.h1')}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder={t('card.search')}
                                                className="h-9"
                                            />
                                            <CommandEmpty>{t('card.404')}</CommandEmpty>
                                            <CommandGroup>
                                                {clientCards.length > 0 ? clientCards.map(card => (
                                                    <CommandItem
                                                        key={card.id}
                                                        className={`${bookingFormData.clientCardID === card.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                        value={card.name}
                                                        onSelect={() => {
                                                            setBookingFormData({ ...bookingFormData, clientCardID: card.id })
                                                            setOpenCard(false)
                                                        }}
                                                    >
                                                        {card.name}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                bookingFormData.clientCardID === card.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )) : <CommandItem>{t('client.select.first')}</CommandItem>}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="w-full items-center gap-1.5">
                                <Label>{t('side_nav.course')}</Label>
                                <Select onValueChange={(courseID) => setBookingFormData({ ...bookingFormData, courseID })} value={bookingFormData.courseID}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('course.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{cardCourses && cardCourses.length > 0 ? t('side_nav.course') : t('card.select.first')}</SelectLabel>
                                            {cardCourses && cardCourses.length > 0 ? cardCourses.map(card => (
                                                <SelectItem value={card.id} key={card.id}>{card.name}</SelectItem>
                                            )) : null}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full items-center gap-1.5">
                                <Label htmlFor="meetingInfoID">{t('meeting.h1')}</Label>
                                <Select onValueChange={(meetingInfoID) => setBookingFormData({ ...bookingFormData, meetingInfoID })} value={bookingFormData.meetingInfoID}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('meeting.select.h1')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{bookingFormData.meetingInfoID && supplierMeetingInfo && supplierMeetingInfo.length === 0 ? t('supplier.no_meeting') : !bookingFormData.supplierID ? t('supplier.select.first') : t('meeting.h1')}</SelectLabel>
                                            {bookingFormData.supplierID && supplierMeetingInfo && supplierMeetingInfo.length > 0 ? supplierMeetingInfo.map(meeting => (
                                                <SelectItem value={meeting.id} key={meeting.id}>{meeting.service} ({meeting.meeting_code})</SelectItem>
                                            )) : null}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full flex flex-col gap-1.5">
                                <Label>{t('info.settlement')}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left gap-3 font-normal",
                                                !bookingFormData.settlement && "text-muted-foreground"
                                            )}
                                        >
                                            <FontAwesomeIcon icon={faCalendar} width={16} height={16} />
                                            {bookingFormData.settlement && isValid(new Date(bookingFormData.settlement))
                                                ? format(new Date(bookingFormData.settlement), "PPP")
                                                : <span>{t('operation.select')}</span>
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(new Date(bookingFormData.settlement).setHours(0, 0, 0, 0))}
                                            onSelect={(date) => {
                                                const adjustedDate = new Date(date!);
                                                adjustedDate.setHours(0, 0, 0, 0);

                                                // Check if the adjusted date is valid
                                                if (!isNaN(adjustedDate.getTime())) {
                                                    const formattedDate = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}`;
                                                    setBookingFormData({
                                                        ...bookingFormData,
                                                        settlement: formattedDate,
                                                    });
                                                } else {
                                                    // If the date is not valid, set settlement to an empty string
                                                    setBookingFormData({
                                                        ...bookingFormData,
                                                        settlement: '',
                                                    });
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className='w-full border-b pb-1 text-center'>{t("info.quantity")}</div>
                            <div className='flex w-full items-center gap-5'>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="client_quantity">{t("side_nav.client")}</Label>
                                    <Input type="number" id="client_quantity" name='client_quantity'
                                        value={bookingFormData.client_quantity}
                                        onChange={handleChange} />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="supplier_quantity">{t("side_nav.supplier")}</Label>
                                    <Input type="number" id="supplier_quantity" name='supplier_quantity'
                                        value={bookingFormData.supplier_quantity}
                                        onChange={handleChange} />
                                </div>

                            </div>

                            <div className='flex flex-col gap-2 w-full'>
                                <Label htmlFor='note'>{t("info.note")}</Label>
                                <Input value={bookingFormData.note} onChange={handleChange} name='note' id='note' placeholder={t("global.optional")} />
                            </div>

                            <div className='flex items-center w-full gap-10'>
                                <Button variant={'destructive'}
                                    className='w-full'
                                    onClick={(e) => deleteSupplierSchedule(e, bookingFormData.scheduleID)}
                                    type='button'>{t("operation.delete")}</Button>
                                <SubmitButton msg={t("operation.confirm")} style='w-full' />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>)
}

export default ScheduleBookingModal