import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

const notFoundRes = (name: string) => {
    return NextResponse.json({ msg: `${name} not found` }, { status: 404 })
}

const serverErrorRes = (data: any) => {
    return NextResponse.json({ msg: 'Server error', error: data }, { status: 500 })
}

const badRequestRes = () => {
    return NextResponse.json({ msg: 'Something went wrong' }, { status: 400 })
}

const okayRes = (data?: any) => {
    if (data) {
        return NextResponse.json({ ok: true, data: data }, { status: 200 })
    }
    return NextResponse.json({ ok: true }, { status: 200 })
}

const createdRes = (data?: any) => {
    if (data) {
        return NextResponse.json({ ok: true, data: data }, { status: 201 })
    }
    return NextResponse.json({ ok: true }, { status: 201 })
}

const existRes = (name: string) => {
    return NextResponse.json({ msg: `${name}_exist` }, { status: 409 })
}

const unauthorizedRes = async () => {
    return NextResponse.json({ msg: 'Sign in First' }, { status: 401 })
}

export { notFoundRes, serverErrorRes, badRequestRes, okayRes, existRes, createdRes, unauthorizedRes }