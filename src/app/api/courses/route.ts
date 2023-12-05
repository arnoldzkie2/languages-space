import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const courseID = searchParams.get('courseID')
    const cardID = searchParams.get('cardID')
    try {

        if (cardID) {
            const card = await prisma.clientCard.findUnique({
                where: { id: cardID }, select: {
                    card: {
                        select: {
                            supported_courses: {
                                select: {
                                    id: true,
                                    name: true,
                                    created_at: true
                                }
                            }
                        }
                    }
                }
            })
            if (!card) return notFoundRes('Card')

            return okayRes(card.card.supported_courses)
        }

        if (courseID) {

            const course = await prisma.courses.findUnique({ where: { id: courseID }, include: { supported_cards: true } })
            if (!course) return notFoundRes('Course')

            return okayRes(course)
        }

        const courses = await prisma.courses.findMany({
            select: {
                id: true,
                name: true,
                created_at: true
            }
        })
        if (!courses) return badRequestRes()

        return okayRes(courses)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: Request) => {

    const { name } = await req.json()

    try {

        if (name) {

            const existingCourse = await prisma.courses.findFirst({ where: { name } })
            if (existingCourse) return existRes('course')

            const newCourse = await prisma.courses.create({ data: { name } })
            if (!newCourse) return badRequestRes()

            return createdRes()
        }

        return notFoundRes('Course Name')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const PATCH = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const courseID = searchParams.get('courseID')
    const { name } = await req.json()

    try {
        if (!name) return notFoundRes('Course Name')

        if (courseID) {

            const updatedCourse = await prisma.courses.update({ where: { id: courseID }, data: { name } })
            if (!updatedCourse) return badRequestRes()

            return createdRes()
        }

        return notFoundRes('courseID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const courseID = searchParams.get('courseID')

    try {

        if (courseID) {
            const deleteCourse = await prisma.courses.delete({ where: { id: courseID } })
            if (!deleteCourse) return badRequestRes()

            return okayRes()
        }

        return notFoundRes('courseID')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}