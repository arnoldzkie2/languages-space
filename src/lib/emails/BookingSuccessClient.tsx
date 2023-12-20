import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ContactProps {
    supplierName: string;
    clientName: string;
    schedule: {
        date: string;
        time: string;
    };
    cardName: string;
    cardBalance: number;
    course: string
    price: number;
    meetingInfo: {
        id: string
        service: string
        meeting_code: string
    }
    operator: string
}

const BookingSuccessClient = ({ cardBalance, clientName, supplierName, schedule, cardName, meetingInfo, price, course, operator }: ContactProps) => {
    return (
        <Html key='success-client'>
            <Head />
            <Preview>Hello {clientName} we recieved your booking request</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover font-sans bg-slate-100">
                    <Container className="border bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl mt-[150px] mx-auto px-10 w-[1000px]">
                        <Heading className="text-black text-[24px] font-normal text-center">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                        </Heading>
                        <Text className="text-lg mt-4">
                            Dear {clientName},<br />
                            {operator === 'admin' ? 'An admin created a booking for you' : 'Your booking has been successfully created!'}
                        </Text>
                        <Text className="text-lg mt-4">
                            Supplier Name: {supplierName}<br />
                            Meeting Info: {meetingInfo.service} - {meetingInfo.meeting_code}<br />
                            <br />
                            Card Used: {cardName}<br />
                            Balance: {cardBalance}<br />
                            Cost: {price}<br />
                            Remaining Balance: {cardBalance - price}<br />
                            <br />
                            Course: {course}<br />
                            Schedule: {schedule.date} at {schedule.time}
                        </Text>
                        <Link href={`${process.env.NEXTAUTH_URL}/client/profile/bookings`} target='_blank'>My Bookings</Link>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BookingSuccessClient;
