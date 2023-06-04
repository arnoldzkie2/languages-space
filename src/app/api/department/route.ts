import { NextResponse } from "next/server";
import prisma from "@/lib/db";
export const POST = async (req: Request) => {

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

}
