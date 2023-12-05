import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { getAuth } from "@/lib/nextAuth";
export const GET = async (req: Request) => {

  const { searchParams } = new URL(req.url)
  const cardID = searchParams.get('cardID')
  const departmentID = searchParams.get('departmentID')

  try {

    const session = await getAuth()
    if (!session) return unauthorizedRes()

    if (session?.user.type === 'client') {

      const clientCards = await prisma.client.findUnique({
        where: { id: session.user.id }, select: {
          cards: {
            select: {
              id: true,
              name: true,
              validity: true,
              balance: true,
              created_at: true
            }
          }
        }
      })
      if (!clientCards) return badRequestRes()

      return okayRes(clientCards.cards)
    }

    //retrieve single card
    if (cardID) {
      const card = await prisma.clientCard.findUnique({ where: { id: cardID } })
      if (!card) return notFoundRes('Client Card')

      return okayRes(card)
    }

    // get all client that has cards in specific department
    if (departmentID) {
      const allClientCard = await prisma.client.findMany({
        where: {
          cards: { some: {} },
          departments: { some: { id: departmentID } }
        }, include: { cards: true }
      })
      if (!allClientCard) return badRequestRes()

      return okayRes(allClientCard)
    }

    //get all client that has cards
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
    return serverErrorRes(error)
  } finally {
    prisma.$disconnect()
  }
}

export const PATCH = async (req: Request) => {

  const { searchParams } = new URL(req.url)
  const cardID = searchParams.get('cardID')

  const { name, price, balance, validity } = await req.json()

  try {

    if (cardID) {

      const card = await prisma.clientCard.findUnique({ where: { id: cardID } })
      if (!card) return notFoundRes('Client Card')

      const updateCard = await prisma.clientCard.update({
        where: { id: cardID },
        data: { name, price, balance, validity }
      })
      if (!updateCard) return badRequestRes()

      return okayRes(updateCard)
    }

    return notFoundRes('cardID')

  } catch (error) {
    console.log(error);
    return serverErrorRes(error)
  } finally {
    prisma.$disconnect()
  }
}

export const DELETE = async (req: Request) => {

  const { searchParams } = new URL(req.url)
  const cardID = searchParams.get('cardID')

  try {

    if (cardID) {

      //retrieve card
      const card = await prisma.clientCard.findUnique({ where: { id: cardID } })
      if (!card) return notFoundRes('Card in Client')

      const unbindCard = await prisma.clientCard.delete({ where: { id: cardID } })
      if (!unbindCard) return badRequestRes()

      return okayRes()

    }

    if (!cardID) return notFoundRes('cardID')

  } catch (error) {
    console.log(error);
    return serverErrorRes(error)
  } finally {
    prisma.$disconnect()
  }

}