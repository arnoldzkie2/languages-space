import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {

    try {

        const allKeywords = await prisma.news.findMany({ select: { keywords: true } })

        const uniqueKeywords = allKeywords
            .flatMap((item) => item.keywords)
            .filter((keyword, index, keywordsArray) => {
                return keywordsArray.indexOf(keyword) === index;
            });

        if (!allKeywords) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ data: uniqueKeywords }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}