import { NextRequest, NextResponse } from "next/server"

const notFoundRes = (name: string) => {
    return NextResponse.json({ msg: `${name} not found` }, { status: 404 })
}

const serverErrorRes = (data: any) => {
    return NextResponse.json({ msg: 'Server error', error: data }, { status: 500 })
}

const badRequestRes = (data?: any) => {
    if (data) return NextResponse.json({ msg: 'Something went wrong', error: data }, { status: 400 })

    return NextResponse.json({ msg: 'Something went wrong' }, { status: 400 })
}

const okayRes = (data?: any) => {
    if (data) return NextResponse.json({ ok: true, data: data }, { status: 200 })

    return NextResponse.json({ ok: true }, { status: 200 })
}

const createdRes = (data?: any) => {
    if (data) return NextResponse.json({ ok: true, data: data }, { status: 201 })

    return NextResponse.json({ ok: true }, { status: 201 })
}

const existRes = (name: string) => {
    return NextResponse.json({ msg: `${name} already exist` }, { status: 409 })
}

const unauthorizedRes = async () => {
    return NextResponse.json({ msg: 'Sign in First' }, { status: 401 })
}

const getSearchParams = ({ url }: NextRequest, key: string) => {
    const { searchParams } = new URL(url)
    return searchParams.get(key)
}

const checkNotFoundParams = (entity: string, value: any) => {
    if (!value) return notFoundRes(entity);
};


export {
    notFoundRes, serverErrorRes, badRequestRes, okayRes,
    existRes, createdRes, unauthorizedRes, getSearchParams, checkNotFoundParams
}