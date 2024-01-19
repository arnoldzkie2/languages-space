import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ContactProps {
    supplierName: string;
    clientName: string;
    schedule: {
        date: string;
        time: string;
    };
    meetingInfo: {
        id: string
        service: string
        meeting_code: string
    }
    course: string
    operator: string
    balance: number
    supplier_rate: number
}

export const BookingCanceledSupplier = ({ supplierName, clientName, schedule, operator, meetingInfo, course, balance, supplier_rate }: ContactProps) => {

    return (
        <Html key={meetingInfo.id}>
            <Head />
            <Preview>Hello {supplierName} your booking is canceled</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover font-sans bg-slate-100">
                    <Container className="border mb-28 bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl mt-[150px] mx-auto px-10 w-[1000px]">
                        <Heading className="text-black text-[24px] font-normal text-center">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                        </Heading>
                        <Text className="mt-3">
                            Dear {supplierName},<br />
                            {
                                operator === 'supplier' ? 'Booking is successfully canceled' : operator === 'admin' ?
                                    'An admin canceled this booking' : operator === 'client' ? 'Client canceled the booking' : 'Booking has been canceled'
                            }
                        </Text>
                        <Text className="mt-3">
                            Client Name: {clientName}<br />
                            Meeting Info: {meetingInfo.service} - {meetingInfo.meeting_code}<br />
                            <br />

                            Course: {course}<br />
                            Schedule: {schedule.date} at {schedule.time} <br />
                        </Text>

                        {operator === 'client' && <Text className='mt-3'>
                            Balance: {balance + supplier_rate} <br />
                            Cancellation Fee: {supplier_rate} <br />
                            Remaining Balance: {balance}
                        </Text>}
                        <Link href={`${process.env.NEXTAUTH_URL}/supplier/profile/bookings`} target='_blank'>My Bookings</Link>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
};

export default BookingCanceledSupplier;
