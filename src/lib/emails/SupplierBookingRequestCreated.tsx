import { Courses, SupplierMeetingInfo, SupplierSchedule } from '@prisma/client';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface SupplierBookingRequestCreated {
    supplierName: string;
    clientName: string
    schedule: {
        date: string
        time: string
    }
    course: string
    meetingInfo: SupplierMeetingInfo
    operator: string
    bookingRequestID: string
}

const SupplierBookingRequestCreated = ({
    bookingRequestID,
    clientName,
    supplierName,
    schedule,
    meetingInfo,
    course,
    operator
}: SupplierBookingRequestCreated) => {
    return (
        <Html key={meetingInfo.id}>
            <Head />
            <Preview>Hello {supplierName} a {operator} created a booking request</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover font-sans bg-slate-100">
                    <Container className="border mb-28 bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl mt-[150px] mx-auto px-10 w-[1000px]">
                        <Heading className="text-black text-[24px] font-normal text-center">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                        </Heading>
                        <Text className="mt-3">
                            Dear {supplierName},<br />
                            {operator} created a booking request
                        </Text>
                        <Text className="mt-3">
                            Client Name: {clientName}<br />
                            Meeting Info: {meetingInfo.service} - {meetingInfo.meeting_code}<br />
                            <br />
                            Course: {course}<br />
                            Schedule: {schedule.date} at {schedule.time}
                        </Text>
                        <Text className='flex items-center gap-5'>
                            <Link href={`${process.env.NEXTAUTH_URL}/supplier/profile/booking-requests/${bookingRequestID}/cancel`} target='_blank' className='text-white mr-5 px-4 py-1 rounded-md bg-red-500'>Cancel</Link>
                            <Link href={`${process.env.NEXTAUTH_URL}/supplier/profile/booking-requests/${bookingRequestID}/confirm`} target='_blank' className='text-white bg-green-500 px-4 py-1 rounded-md'>Confirm</Link>
                        </Text>
                        <Link href={`${process.env.NEXTAUTH_URL}/supplier/profile/booking-requests`} target='_blank'>My Booking Request</Link>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SupplierBookingRequestCreated;
