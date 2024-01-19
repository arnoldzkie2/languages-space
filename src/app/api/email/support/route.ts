import resend from "@/utils/getResend";
import { NextRequest, NextResponse } from "next/server";
import ContactSupport from "@/lib/emails/ContactSupport";
import ThankyouEmail from "@/lib/emails/ThankyouEmail";
import { getAuth } from "@/lib/nextAuth";
import { okayRes, unauthorizedRes } from "@/utils/apiResponse";

export const POST = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        const { name, email, phone, message } = await req.json()

        Promise.all([
            resend.emails.send({
                from: 'VerbalAce <support@verbalace.com>',
                to: email,
                subject: 'Welcome to VerbalAce - Mastering English Made Fun and Easy!',
                react: ThankyouEmail({ name }),
                reply_to: 'VerbalAce <support@verbalace.com>'
            }),
            resend.emails.send({
                from: `${name} <website@verbalace.com>`,
                to: 'support@verbalace.com',
                subject: 'VerbalAce Contact Message',
                react: ContactSupport({ name, email, phone, message }),
                reply_to: `${name} <${email}>`
            })
        ])

        return okayRes()

    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: 'Server error' }, { status: 500 })
    }
}