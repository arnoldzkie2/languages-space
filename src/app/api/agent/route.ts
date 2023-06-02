import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export const POST = async (req: Request) => {

    const { name, profile, type, organization, payment_information, phone_number, email, address, gender, card, origin, note } = await req.json()

    try {

        const existingEmail = await prisma.agent.findFirst({
            where: {
                email: email
            }
        })

        if (existingEmail) return NextResponse.json({ success: false, error: false, message: 'Email already exist!' }, { status: 200 })

        const newAgent = await prisma.agent.create({
            data: {
                profile: profile,
                name: name,
                type: type,
                organization: organization,
                phone_number: phone_number,
                payment_information: payment_information,
                email: email,
                address: address,
                gender: gender,
                card: card,
                origin: origin,
                note: note
            }
        })

        if (!newAgent) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: newAgent }, { status: 200 })

    } catch (error) {

        console.log(error);
    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')


    try {

        const checkId = await prisma.agent.findFirst({
            where: {
                id: String(id)
            }
        })

        if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found' }, { status: 404 })

        const singleAgent = await prisma.agent.findMany({
            where: {
                id: String(id)
            }
        })

        if (!singleAgent) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: singleAgent }, { status: 200 })

    } catch (error) {

        console.log(error);
    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    const { name, profile, type, organization, payment_information, phone_number, email, address, gender, card, origin, note } = await req.json()

    try {

        const checkId = await prisma.agent.findFirst({
            where: {
                id: String(id)
            }
        })

        if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found' }, { status: 404 })

        const existingEmail = await prisma.agent.findFirst({
            where: {
                email: email
            }
        })

        if (existingEmail) return NextResponse.json({ success: false, error: false, message: 'Email already exist!' }, { status: 200 })

        const updatedAgent = await prisma.agent.create({
            data: {
                profile: profile,
                name: name,
                type: type,
                organization: organization,
                phone_number: phone_number,
                payment_information: payment_information,
                email: email,
                address: address,
                gender: gender,
                card: card,
                origin: origin,
                note: note
            }
        })

        if (!updatedAgent) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: updatedAgent }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const checkId = await prisma.agent.findFirst({
            where: {
                id: String(id)
            }
        })

        if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found' }, { status: 404 })

        const deletedAgent = await prisma.agent.delete({
            where: {
                id: String(id)
            }
        })

        if (!deletedAgent) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: deletedAgent }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

