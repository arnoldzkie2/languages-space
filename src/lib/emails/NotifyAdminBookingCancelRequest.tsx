import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ContactProps {
    adminUsername: string
    supplierUsername: string;
    clientUsername: string;
    note: string
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
    operator: string
}

const NotifyAdminBookingCancelRequest = ({ clientUsername, supplierUsername, schedule, adminUsername, note, meetingInfo, course, operator }: ContactProps) => {
    return (
        <Html key={meetingInfo.id}>
            <Head />
            <Preview>Hello {adminUsername} {operator} request to cancel a booking</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover font-sans bg-slate-100">
                    <Container className="border mb-28 bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl mt-[150px] mx-auto px-10 w-[1000px]">
                        <Heading className="text-black text-[24px] font-normal text-center">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                        </Heading>
                        <Text className="mt-3">
                            Dear {adminUsername},<br />
                            {operator} request to cancel this booking
                        </Text>
                        <Text className="mt-3">
                            Supplier Username: {supplierUsername}<br />
                            Client Username: {clientUsername} <br /><br />
                            Meeting Info: {meetingInfo.service} - {meetingInfo.meeting_code}<br />
                            Course: {course}<br />
                            Schedule: {schedule.date} at {schedule.time}
                        </Text>
                        <Text className='mt-3'>
                            Note: {note}
                        </Text>
                        <Link href={`${process.env.NEXTAUTH_URL}/admin`} target='_blank'>View All Bookings</Link>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default NotifyAdminBookingCancelRequest;
