import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
import { getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { checkIsAdmin } from "@/utils/checkUser";
import { ADMIN } from "@/utils/constants";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        //only allow admin to proceed
        if (session.user.type !== ADMIN) return unauthorizedRes()

        const admin = await prisma.admin.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                department_permission: {
                    select: {
                        department: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!admin) return notFoundRes(ADMIN)
        //return 404 response if admin not found

        //return admin departments
        return okayRes(admin.department_permission)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}