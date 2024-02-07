/* eslint-disable react/no-unescaped-entities */
import { Body, Column, Container, Head, Heading, Hr, Html, Img, Preview, Row, Section, Tailwind, Text } from '@react-email/components';
import * as React from 'react';


interface EarningsAndDeductions {
    id: string;
    name: string;
    quantity: number;
    rate: any;
    amount: any;
}

interface ContactProps {
    name: string;
    date: string;
    balanceID: string
    earnings: EarningsAndDeductions[]
    deductions: EarningsAndDeductions[]
    currency: string
    position: string
}

export const Payslip = (
    { name,
        date,
        balanceID,
        earnings,
        deductions,
        currency,
        position
    }: ContactProps) => {

    const totalDeductions = deductions.length > 0 ? deductions.reduce((total: number, deduction: any) => total + deduction.amount, 0) : 0
    const totalEarnings = earnings.length > 0 ? earnings.reduce((total: number, earning: any) => total + earning.amount, 0) : 0

    const returnCurrency = (currency: string) => {
        switch (currency) {
            case 'USD':
                return '$'
            case 'PHP':
                return '₱'
            case 'VND':
                return '₫'
            case 'RMB':
                return '¥'
            default:
                return 'Unknown Currency'
        }
    }

    return (
        <Html key={balanceID}>
            <Head />
            <Preview>Hello {name} this is your payslip for last month.</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover bg-slate-100 font-sans py-10">
                    <Heading className='text-slate-700'>
                        <Text className='font-normal text-center'>
                            I hope this message finds you well. Attached is your payslip for the month of MONTH 2024. <br />
                            Please review the payslip to ensure that all details are accurate.<br />
                            If you have any questions or notice any discrepancies, please don't hesitate to reach out to XXX <br />
                            Thank you for your dedication and hard work. We appreciate your contributions to VerbalAce.<br />
                        </Text>
                    </Heading>
                    <Container className="bg-white text-gray-600 rounded-md shadow-2xl py-5 pb-10 border border-solid border-slate-200 mx-auto px-10 min-w-[600px]">
                        <Section className='pl-2'>
                            <Img src='https://www.verbalace.com/logo.png' className='w-44 h-auto mx-auto' />
                            <Row>
                                <Column colSpan={3}>
                                    <Text className='text-base'>
                                        Pay Period: <strong className='text-slate-800'>{date}</strong> <br />
                                        Employee: <strong className='text-slate-800'>{name}</strong>
                                    </Text>
                                </Column>
                                <Column colSpan={3}>
                                    <Text className='text-base'>
                                        <br />
                                        Position: <strong className='text-slate-800'>{position}</strong>
                                    </Text>
                                </Column>
                            </Row>
                        </Section>
                        <Section className='bg-blue-600 text-white text-center rounded-t-sm'>
                            <Text>
                                <strong className='text-3xl font-black'>
                                    PAYSLIP
                                </strong>
                            </Text>
                        </Section>
                        {earnings.length > 0 && <Section className='bg-slate-100 px-5'>
                            <Row>
                                {[
                                    { header: 'EARNINGS', width: 'w-32' },
                                    { header: 'RATE', width: 'w-20' },
                                    { header: 'QUANTITY', width: 'w-20' },
                                    { header: 'AMOUNT', width: 'w-20' },
                                ].map((column, index) => (
                                    <Column key={index} colSpan={4}>
                                        <Row>
                                            <Column className='text-xs'>
                                                <Text className={`text-sm ${column.width} font-black text-slate-600`}>{column.header}</Text>
                                                <Text>
                                                    {earnings.map((obj: any) => (
                                                        <div key={obj.id} className='text-slate-900 text-sm'>
                                                            {column.header === 'EARNINGS' ? obj.name :
                                                                column.header === 'RATE' ? obj.rate :
                                                                    column.header === 'QUANTITY' ? obj.quantity :
                                                                        column.header === 'AMOUNT' ? obj.amount : null}
                                                        </div>
                                                    ))}
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Column>
                                ))}
                            </Row>
                            <Hr className="border border-solid border-slate-300 mx-0 w-full" />
                        </Section>}

                        {deductions.length > 0 && <Section className='bg-slate-100 px-5'>
                            <Row>
                                {[
                                    { header: 'DEDUCTIONS', width: 'w-32' },
                                    { header: 'RATE', width: 'w-20' },
                                    { header: 'QUANTITY', width: 'w-20' },
                                    { header: 'AMOUNT', width: 'w-20' },
                                ].map((column, index) => (
                                    <Column key={index} colSpan={4}>
                                        <Row>
                                            <Column className='text-xs'>
                                                <Text className={`text-sm ${column.width} font-black text-slate-600`}>{column.header}</Text>
                                                <Text>
                                                    {deductions.map((obj: any) => (
                                                        <div key={obj.id} className='text-slate-900 text-sm'>
                                                            {column.header === 'DEDUCTIONS' ? obj.name :
                                                                column.header === 'RATE' ? obj.rate :
                                                                    column.header === 'QUANTITY' ? obj.quantity :
                                                                        column.header === 'AMOUNT' ? obj.amount : null}
                                                        </div>
                                                    ))}
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Column>
                                ))}
                            </Row>
                        </Section>}

                        <Section align="right" className='bg-blue-600 text-white rounded-b-sm'>
                            <Column align="right">
                                <Text className='mr-1'>
                                    <strong>
                                        TOTAL DEDUCTIONS <br />
                                    </strong>
                                    <strong>
                                        NET PAY <br />
                                    </strong>
                                </Text>
                            </Column>
                            <Column align='left'>
                                <Text >
                                    <strong>
                                        = {returnCurrency(currency)}{totalDeductions} <br />
                                    </strong>
                                    <strong>
                                        = {returnCurrency(currency)}{totalEarnings} <br />
                                    </strong>
                                </Text>
                            </Column>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
};

export default Payslip;
