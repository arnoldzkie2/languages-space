import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ContactProps {
    supplierName: string;
    clientName: string;
    schedule: {
        date: string;
        time: string;
    };
    course: string
    meetingInfo: {
        id: string
        service: string
        meeting_code: string
    }
}

const BookingSuccessSupplier = ({ clientName, supplierName, schedule, meetingInfo, course }: ContactProps) => {
    return (
        <Html>
            <Head />
            <Preview>Hello {supplierName} a client has created a booking in you at www.languages-space.com</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover font-sans bg-slate-100">
                    <Container className="border bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl mt-[150px] mx-auto px-10 w-[1000px]">
                        <Heading className="text-black text-[24px] font-normal text-center">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                        </Heading>
                        <Text className="text-center text-lg mt-4">
                            Dear {supplierName},<br />
                            {clientName} booked a schedule to you
                        </Text>
                        <Text className="text-lg mt-4">
                            Client Name: {clientName}<br />
                            Meeting Info: {meetingInfo.service} - {meetingInfo.meeting_code}<br />
                            <br />
                            Course: {course}<br />
                            Schedule: {schedule.date} at {schedule.time}
                        </Text>
                        <Link href={`${process.env.NEXTAUTH_URL}/supplier/profile/bookings`} target='_blank'>My Bookings</Link>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BookingSuccessSupplier;
