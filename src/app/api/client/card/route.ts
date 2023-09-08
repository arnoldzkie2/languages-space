import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const clientID = searchParams.get('clientID')

    try {

        if (clientID) {

            const clientCard = await prisma.client.findUnique({ where: { id: clientID }, include: { cards: true } })

            if (!clientCard) return notFoundRes('Client Card')

            return okayRes(clientCard)

        }

        const clientsWithCards = await prisma.client.findMany({
            where: {
              cards: {
                some: {},
              },
            },
            include: { cards: true },
          })

        if(!clientsWithCards) return badRequestRes()

        return okayRes(clientsWithCards)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()

    }

}

