import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const departmentID = searchParams.get('departmentID')

    try {

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

        return serverErrorRes()

    }

}