/* eslint-disable react/no-unescaped-entities */
import { Body, Container, Head, Heading, Html, Preview, Tailwind, Text, Img, Hr } from '@react-email/components';
import * as React from 'react';


interface NewsPublishProps {
    name: string;
}

export const PublishNewsContent = (
    { name,
    }: NewsPublishProps) => {

    return (
        <Html key={name}>
            <Head />
            <Preview>Action Required: Increase Published News Content</Preview>
            <Tailwind>
                <Body className="grid place-items-center bg-center bg-no-repeat bg-cover bg-slate-100 font-sans py-10">
                    <Container className="border bg-white border-solid border-[#eaeaea] text-gray-600 rounded-3xl shadow-2xl my-[60px] mx-auto px-10 w-[1000px]">
                        <Heading className="font-normal">
                            <Img src='https://www.verbalace.com/logo.png' className='w-40 h-auto mx-auto' />
                            <Text>Dear, {name}</Text>
                            <Text className='text-lg'>
                                We hope this message finds you well.
                            </Text>
                        </Heading>
                        <Text className="text-[14px] leading-[24px]">
                            We wanted to bring to your attention that the number of published news articles on our platform
                            is currently below our target threshold. It's crucial to keep our audience engaged and informed with
                            regular updates. To maintain a vibrant and active platform, we encourage you to publish new articles at your earliest convenience.                        </Text>
                        <Text className="text-[14px] leading-[24px]">
                            Your contributions play a vital role in providing valuable content to our audience, so we kindly request your
                            assistance in increasing the number of published news articles.
                        </Text>
                        <Text>Thank you for your attention to this matter.</Text>
                        <Text className='font-medium'>Best regards,</Text>
                        <Text><strong className='text-gray-700'>Languages Space Team</strong></Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
};

export default PublishNewsContent;
