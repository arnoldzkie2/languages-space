import { badRequestRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";

export const GET = async (req: Request) => {

    try {

        const allKeywords = await prisma.news.findMany({ select: { keywords: true } })

        const uniqueKeywords = allKeywords
            .flatMap((item) => item.keywords)
            .filter((keyword, index, keywordsArray) => {
                return keywordsArray.indexOf(keyword) === index;
            });

        if (!allKeywords) return badRequestRes()

        return okayRes(uniqueKeywords)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }

}