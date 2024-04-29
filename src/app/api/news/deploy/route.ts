import prisma from "@/lib/db";
import { badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import axios from "axios";

export const POST = async () => {

    try {

        const departments = await prisma.department.findMany({
            select: {
                news: {
                    orderBy: {
                        created_at: 'asc'
                    },
                    select: {
                        id: true,
                        published: true
                    }
                }
            }
        })
        if (!departments) return badRequestRes()

        await Promise.all(departments.map(async (dept) => {

            const unPublishedNews = dept.news.filter(news => !news.published);

            if (unPublishedNews.length < 11) {

                await axios.post(`${process.env.NEXTAUTH_URL}/api/email/news-published`)

                //if news is less than 10 remind admin to add more news
            }

            const settings = await prisma.settings.findMany()
            const newsToPublish = settings[0].deploy_news

            // Update only if there are unpublished news and newsToPublish is defined
            if (unPublishedNews.length > 0 && newsToPublish) {
                const newsToUpdate = unPublishedNews.slice(0, newsToPublish); // Select the first 'newsToPublish' number of news

                //publish news
                await Promise.all(newsToUpdate.map(async (news) => {

                    await prisma.news.update({
                        where: { id: news.id },
                        data: {
                            published: true, created_at: new Date()
                        }
                    });

                }));
            }
        }))

        return okayRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}