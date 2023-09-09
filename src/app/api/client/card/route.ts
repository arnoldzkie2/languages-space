import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";
import prisma from "@/lib/db";

export const GET = async (req: Request) => {

  const { searchParams } = new URL(req.url)

  const clientID = searchParams.get('clientID')

  const departmentID = searchParams.get('departmentID')

  try {

    if (clientID) {

      const clientCard = await prisma.client.findUnique({ where: { id: clientID }, include: { cards: true } })

      if (!clientCard) return notFoundRes('Client Card')

      return okayRes(clientCard)

    }

    if (departmentID) {

      const allClientCard = await prisma.client.findMany({ where: { cards: { some: {} }, departments: { some: { id: departmentID } } }, include: { cards: true } })

      if (!allClientCard) return badRequestRes()

      return okayRes(allClientCard)

    }

    const clientsWithCards = await prisma.client.findMany({
      where: {
        cards: {
          some: {},
        },
      },
      include: { cards: true },
    })

    if (!clientsWithCards) return badRequestRes()

    return okayRes(clientsWithCards)

  } catch (error) {

    console.log(error);

    return serverErrorRes()

  } finally {

    prisma.$disconnect()

  }

}

