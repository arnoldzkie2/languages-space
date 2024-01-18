import { SupplierMeetingInfo } from '@prisma/client';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ClientBookingRequestCreated {
    supplierName: string;
    clientName: string;
    schedule: {
        date: string;
        time: string;
    };
    cardName: string
    course: string
    meetingInfo: SupplierMeetingInfo
    operator: string
    cardBalance: number
    price: number
}

const ClientBookingRequestCreated = ({
    clientName,
    supplierName,
    schedule,
    cardName,
    meetingInfo,
    course,
    operator,
    cardBalance,
    price }: ClientBookingRequestCreated) => {
    return (
        <Html key={meetingInfo.id}>
            <Head />
            <Preview>Hello {clientName} we recieved your booking request</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover font-sans bg-slate-100">
                    <Container className="border mb-28 bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl mt-[150px] mx-auto px-10 w-[1000px]">
                        <Heading className="text-black text-[24px] font-normal text-center">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                        </Heading>
                        <Text className="mt-3">
                            Dear {clientName},<br />
                            {operator === 'admin' ? 'An admin created a booking request for you' : 'Your booking request has been successfully created!'}
                        </Text>
                        <Text className="mt-3">
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
                        <Link href={`${process.env.NEXTAUTH_URL}/client/profile/booking-requests`} target='_blank'>My Booking Requests</Link>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ClientBookingRequestCreated;
