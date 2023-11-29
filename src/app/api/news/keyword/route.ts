import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const departmentID = searchParams.get('departmentID')
    const keyword = searchParams.get('keyword')

    try {

        if (keyword && departmentID) {

            const RelatedNews = await prisma.news.findMany({
                where: { department: { id: departmentID }, keywords: { array_contains: keyword } }
            })
            if (!RelatedNews) return badRequestRes()

            return okayRes(RelatedNews)

        }

        if (departmentID) {

            const allKeywords = await prisma.news.findMany({ where: { department: { id: departmentID } }, select: { keywords: true } })

            const uniqueKeywords = allKeywords
                .flatMap((item) => item.keywords)
                .filter((keyword, index, keywordsArray) => {
                    return keywordsArray.indexOf(keyword) === index;
                });
            if (!allKeywords) return badRequestRes()

            return okayRes(uniqueKeywords)

        }

        return notFoundRes('departmentID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    }
}