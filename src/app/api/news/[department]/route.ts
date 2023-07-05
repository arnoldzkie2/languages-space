import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { department: string } }) => {

    const { department } = params

    try {

        const allNews = await prisma.news.findMany({
            where: {
                departments: {
                    array_contains: department
                }
            },
            select: { id: true }
        })

        if (allNews) return NextResponse.json({ succes: true, data: allNews }, { status: 200 })

        return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

    } catch (error) {

        console.log(error);

    } finally {
        prisma.$disconnect()
    }
}
