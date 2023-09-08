import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

    const { content, title, author, keywords, departmentID } = await req.json()

    try {

        const createNews = await prisma.news.create({
            data: { content, title, author, keywords, department: { connect: { id: departmentID } } }
            , include: { department: true }
        })

        if (!createNews) return badRequestRes()

        return okayRes(createNews)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const newsID = searchParams.get('newsID')

    const keyword = searchParams.get('keyword')

    const departmentID = searchParams.get('departmentID')

    try {

        if (keyword && departmentID) {

            const AllNews = await prisma.department.findUnique({
                where: {
                    id: departmentID
                },
                include: {
                    news: true
                }
            })

            if (!AllNews) return badRequestRes()

            const keywordNews = AllNews.news.filter(item => item.keywords === keyword)

            if (!keywordNews) return badRequestRes()

            return okayRes(keywordNews)
        }

        if (departmentID) {

            const newsDepartment = await prisma.department.findUnique({
                where: { id: departmentID }, include: { news: true }
            })

            if (!newsDepartment) return badRequestRes()

            return okayRes(newsDepartment.news)
        }

        if (newsID) {

            const singleNews = await prisma.news.findUnique({
                where: { id: newsID },
                include: { department: true }
            })

            if (!singleNews) return notFoundRes('News')

            return okayRes(singleNews)

        }

        const allNews = await prisma.news.findMany()

        if (!allNews) return badRequestRes()

        return okayRes(allNews)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()
    }

}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const newsID = searchParams.get('newsID');

    const { content, title, author, keywords, departmentID } = await req.json()

    try {

        if (newsID) {

            const checkNews = await prisma.news.findUnique({
                where: { id: newsID },
                include: { department: true }
            })

            if (!checkNews) return notFoundRes('News')

            const updatedNews = await prisma.news.update({
                where: { id: newsID },
                data: {
                    content,
                    title,
                    author,
                    keywords,
                    department: { connect: { id: departmentID } },
                },
                include: { department: true },
            });

            if (!updatedNews) return badRequestRes()

            return okayRes(updatedNews)

        }

        return notFoundRes('newsID')

    } catch (error) {

        console.log(error);

        return serverErrorRes();

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

            })

            if (deletedNews.count === 0) return notFoundRes('News')

            return NextResponse.json({ ok: true }, { status: 200 });

        }

        return notFoundRes('Nwes')

    } catch (error) {

        console.log(error);

        return serverErrorRes();

    } finally {

        prisma.$disconnect();
    }
}