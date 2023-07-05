import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { content, title, author, keywords, departments } = await req.json()

    try {

        const existingTitle = await prisma.news.findFirst({
            where: { title: String(title) }
        })

        if (existingTitle) return NextResponse.json({ success: false, error: true, message: 'News title already exist' }, { status: 409 })

        const createNews = await prisma.news.create({
            data: { content, title, author, keywords, departments }
        })

        if (!createNews) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: createNews }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {
        prisma.$disconnect()
    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    const keyword = searchParams.get('keyword')

    const department = searchParams.get('department')

    try {

        if (keyword && department) {

            const keywordNews = await prisma.news.findMany({
                where: {
                    departments: {
                        array_contains: String(department)
                    },
                    keywords: {
                        array_contains: String(keyword)
                    }
                }
            })

            if (!keywordNews) return NextResponse.json({ succes: false, error: true, message: 'Server error' }, { status: 500 })

            if (keywordNews) return NextResponse.json({ success: true, data: keywordNews }, { status: 200 })

        }

        if (department) {

            const newsDepartment = await prisma.news.findMany({
                where: {
                    departments: {
                        array_contains: String(department)
                    }
                }
            })

            if (!newsDepartment) return NextResponse.json({ succes: false, error: true, message: 'Server error' }, { status: 500 })

            if (newsDepartment) return NextResponse.json({ success: true, data: newsDepartment }, { status: 200 })
        }

        if (id) {

            const checkId = await prisma.news.findUnique({
                where: { id }
            })

            if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No news found' }, { status: 404 })

            const singleNews = await prisma.news.findUnique({
                where: { id }
            })

            if (!singleNews) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

            return NextResponse.json({ success: true, data: singleNews }, { status: 200 })

        }

        const allNews = await prisma.news.findMany()

        if (!allNews) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: allNews }, { status: 200 })

    } catch (error) {

        console.log(error);

    } finally {
        prisma.$disconnect()
    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    const { content, title, author, keywords } = await req.json()

    try {

        if (id) {

            const checkId = await prisma.news.findUnique({
                where: { id }

            })

            if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No news found' }, { status: 404 })

            const updatedNews = await prisma.news.update({
                where: { id },
                data: { content, title, author, keywords }
            })

            if (!updatedNews) return NextResponse.json({ success: false, error: true, message: 'Something went wrong' }, { status: 400 })

            return NextResponse.json({ success: true, data: updatedNews }, { status: 200 })
        }

    } catch (error) {

        console.log(error);

    } finally {

        prisma.$disconnect()

    }

}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const ids = searchParams.getAll('id');

    try {

        if (ids.length > 0) {

            const deletedNews = await prisma.news.deleteMany({

                where: { id: { in: ids } },

            });

            if (deletedNews.count === 0) return NextResponse.json({ success: false, error: true, message: 'No news items found' }, { status: 404 });

            return NextResponse.json({ success: true, data: deletedNews, message: 'Deleted news items' }, { status: 200 });

        }

        return NextResponse.json({ success: false, error: true, message: 'No news items selected' }, { status: 400 });

    } catch (error) {

        console.log(error);

        return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 });

    } finally {

        prisma.$disconnect();
    }
}