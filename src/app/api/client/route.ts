import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export const POST = async (req: Request) => {

    const { name, type, organization, phone_number, email, address, gender, origin, tags, note } = await req.json()

    try {

        const existingClient = await prisma.client.findFirst({
            where: {
                email: email
            }
        })

        if (existingClient) return NextResponse.json({ success: true, data: { email: email }, message: 'Email already exist!' }, { status: 200 })

        const newUser = await prisma.client.create({
            data: {
                name: name,
                type: type,
                organization: organization,
                phone_number: phone_number,
                email: email,
                address: address,
                gender: gender,
                origin: origin,
                tags: tags,
                note: note
            }
        })

        if (!newUser) return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 })

        return NextResponse.json({ success: true, data: newUser }, { status: 200 })

    } catch (error) {
        console.log(error);
    }
}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    try {

        const checkId = await prisma.client.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!checkId) return NextResponse.json({ success: false, message: 'no id found' }, { status: 404 })

        const client = await prisma.client.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!client) return NextResponse.json({ success: false, message: 'no id found' }, { status: 404 })

        return NextResponse.json({ success: true, data: client }, { status: 200 })

    } catch (error) {
        console.log(error);
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    try {

        const checkId = await prisma.client.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!checkId) return NextResponse.json({ success: false, message: 'no id found' }, { status: 404 })

        const deletedClient = await prisma.client.delete({
            where: {
                id: Number(id)
            }
        })

        if (!deletedClient) return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: deletedClient, message: 'Client deleted' }, { status: 200 })

    } catch (error) {
        console.log(error);
    }
}

export const PATCH = async (req: Request) => {

    const { name, type, organization, phone_number, email, address, gender, origin, tags, note } = await req.json()

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    try {

        const checkId = await prisma.client.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!checkId) return NextResponse.json({ success: false, message: 'no id found' }, { status: 404 })

        const existingClient = await prisma.client.findFirst({
            where: {
                email: email
            }
        })

        if (existingClient) return NextResponse.json({ success: true, message: 'Email already exist!' }, { status: 200 })

        const updatedClient = await prisma.client.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name,
                type: type,
                organization: organization,
                phone_number: phone_number,
                email: email,
                address: address,
                gender: gender,
                origin: origin,
                tags: tags,
                note: note
            }
        })

        if (!updatedClient) return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: updatedClient, message: 'Client updated' })

    } catch (error) {
        console.log(error);
    }
}