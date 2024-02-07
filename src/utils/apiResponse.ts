import { NextRequest, NextResponse } from "next/server"

//404 response
const notFoundRes = (name: string) => {
    return NextResponse.json({ msg: `${name} not found` }, { status: 404 })
}

//500 response
const serverErrorRes = (data: any) => {
    return NextResponse.json({ msg: 'Server error', error: data }, { status: 500 })
}

//400 response
const badRequestRes = (data?: any) => {
    if (data) return NextResponse.json({ msg: data, error: "Something went wrong" }, { status: 400 })

    return NextResponse.json({ msg: 'Something went wrong' }, { status: 400 })
}

//200 response
const okayRes = (data?: any) => {
    if (data) return NextResponse.json({ ok: true, data: data }, { status: 200 })

    return NextResponse.json({ ok: true }, { status: 200 })
}

//201 response
const createdRes = (data?: any) => {
    if (data) return NextResponse.json({ ok: true, data: data }, { status: 201 })

    return NextResponse.json({ ok: true }, { status: 201 })
}

//409 response
const existRes = (name: string) => {
    return NextResponse.json({ msg: `${name} already exist` }, { status: 409 })
}

//401 response
const unauthorizedRes = () => {
    return NextResponse.json({ msg: 'Unauthorized try re-login' }, { status: 401 })
}

//get searchParameters
const getSearchParams = ({ url }: NextRequest, key: string) => {
    const { searchParams } = new URL(url)
    return searchParams.get(key)
}

export {
    notFoundRes,
    serverErrorRes,
    badRequestRes,
    okayRes,
    existRes,
    createdRes,
    unauthorizedRes,
    getSearchParams,
}