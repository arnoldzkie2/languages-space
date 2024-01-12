/* eslint-disable react/no-unescaped-entities */
import { Body, Column, Container, Head, Heading, Hr, Html, Img, Preview, Row, Section, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ContactProps {
    name: string;
    amount: string;
    transactionID: string
}

export const RequestPaymentReceived = (
    {
        name,
        amount,
        transactionID
    }: ContactProps) => {

    return (
        <Html key={transactionID}>
            <Head />
            <Preview>Hello {name} we received your payment request</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover bg-slate-100 font-sans py-10">
                    <Heading className='text-slate-700'>
                        <Text className='font-normal text-center'>
                            Dear {name}, <br />

                            I hope this message finds you well. <br />
                            We would like to acknowledge that we have received your payment request. <br /> <br />

                            Our team is currently processing your request, <br />
                            and you will receive confirmation details once the payment has been successfully completed. <br /> <br />

                            If you have any questions or require further assistance, <br />
                            please feel free to reach out to us. <br /> <br />

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
                                                Pending
                                            </Text>
                                        </Column>
                                    </Row>
                                </Column>
                                <Column colSpan={3}>
                                    <Row>
                                        <Column className='text-xs'>
                                            <Text className={`text-sm w-20 font-black text-slate-600`}>PAID BY</Text>
                                            <Text>
                                                Pending
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

export default RequestPaymentReceived;
