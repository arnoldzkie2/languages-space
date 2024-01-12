/* eslint-disable react/no-unescaped-entities */
import { Body, Column, Container, Head, Heading, Hr, Html, Img, Preview, Row, Section, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ContactProps {
    name: string;
    paidBy: string;
    amount: string;
    transactionID: string
}

export const PaymentCompleted = (
    { name,
        amount,
        paidBy,
        transactionID
    }: ContactProps) => {

    return (
        <Html key={transactionID}>
            <Head />
            <Preview>Hello {name} your payment request is completed</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover bg-slate-100 font-sans py-10">
                    <Heading className='text-slate-700'>
                        <Text className='font-normal text-center'>
                            Dear {name}, <br />

                            I hope this message finds you well. <br />
                            I am pleased to inform you that your payment request has been successfully processed. <br /> <br />

                            Attached, you will find confirmation details for the completed payment. <br />
                            Please take a moment to review the information to ensure accuracy. <br /> <br />

                            We sincerely appreciate your promptness and cooperation throughout this process. <br />
                            Your commitment is valuable to us. <br /> <br />

                            Best regards,<br />
                            VerbalaAce Team
                        </Text>

                    </Heading>
                    <Container className="bg-white text-gray-600 rounded-md shadow-2xl py-5 pb-10 border border-solid border-slate-200 mx-auto px-10 min-w-[600px]">
                        <Section className='px-5'>
                            <Img src='https://www.verbalace.com/logo.png' className='w-44 h-auto mx-auto' /> <br />
                        </Section>
                        <Text className='px-5'>
                            Transaction ID: <strong>{transactionID}</strong>
                        </Text>
                        <Section className='bg-slate-100 px-5'>
                            <Row>
                                <Column colSpan={3}>
                                    <Row>
                                        <Column className='text-xs'>
                                            <Text className={`text-sm w-20 font-black text-slate-600`}>AMOUNT</Text>
                                            <Text>
                                                {amount}
                                            </Text>
                                        </Column>
                                    </Row>
                                </Column>
                                <Column colSpan={3}>
                                    <Row>
                                        <Column className='text-xs'>
                                            <Text className={`text-sm w-16 font-black text-slate-600`}>STATUS</Text>
                                            <Text>
                                                Completed
                                            </Text>
                                        </Column>
                                    </Row>
                                </Column>
                                <Column colSpan={3}>
                                    <Row>
                                        <Column className='text-xs'>
                                            <Text className={`text-sm w-20 font-black text-slate-600`}>PAID BY</Text>
                                            <Text>
                                                {paidBy}
                                            </Text>
                                        </Column>
                                    </Row>
                                </Column>
                            </Row>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html >
    )
};

export default PaymentCompleted;
