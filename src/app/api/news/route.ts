import { badRequestRes, createdRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { checkIsAdmin } from "@/utils/checkUser";

export const POST = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { content, title, author, keywords, departmentID } = await req.json()

        const createNews = await prisma.news.create({
            data: { content, title, author, keywords, department: { connect: { id: departmentID } } }
            , include: { department: true }
        })
        if (!createNews) return badRequestRes()

        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const GET = async (req: Request) => {

    try {

        const { searchParams } = new URL(req.url)
        const newsID = searchParams.get('newsID')
        const departmentID = searchParams.get('departmentID')
        const published = searchParams.get("published")

        if (newsID) {

            const singleNews = await prisma.news.findUnique({
                where: { id: newsID },
                include: { department: true }
            })
            if (!singleNews) return notFoundRes('News')

            return okayRes(singleNews)
        }

        if (departmentID) {


            //if published is provided then retrieve all news that is ready to be seen in official websites
            if (published) {

                const department = await prisma.department.findUnique({
                    where: { id: departmentID },
                    select: {
                        news: {
                            where: {
                                published: true
                            },
                            select: {
                                id: true,
                                title: true,
                                author: true,
                                keywords: true,
                                created_at: true,
                                updated_at: true
                            }
                        }
                    }
                })
                if (!department) return badRequestRes()

                return okayRes(department.news)
            }

            const department = await prisma.department.findUnique({
                where: { id: departmentID },
                select: {
                    news: {
                        select: {
                            id: true,
                            title: true,
                            author: true,
                            keywords: true,
                            created_at: true,
                            updated_at: true
                        }
                    }
                }
            })
            if (!department) return badRequestRes()

            return okayRes(department.news)
        }

        const allNews = await prisma.news.findMany({
            select: {
                id: true,
                title: true,
                author: true,
                keywords: true,
                created_at: true,
                updated_at: true
            }
        })
        if (!allNews) return badRequestRes()

        return okayRes(allNews)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: Request) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { searchParams } = new URL(req.url);
        const newsID = searchParams.get('newsID');
        const { content, title, author, keywords, departmentID } = await req.json()

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

            return okayRes()

        }

        return notFoundRes('newsID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect()
    }

}

export const DELETE = async (req: Request) => {

    try {
        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        const { searchParams } = new URL(req.url);
        const ids = searchParams.getAll('newsID');

        if (ids.length > 0) {

            const deletedNews = await prisma.news.deleteMany({
                where: { id: { in: ids } },

            })
            if (deletedNews.count === 0) return notFoundRes("News")
            return okayRes()
        }

        return notFoundRes('News')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
}