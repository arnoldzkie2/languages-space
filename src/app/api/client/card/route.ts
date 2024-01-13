import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { getAuth } from "@/lib/nextAuth";
import { checkIsAdmin } from "@/utils/checkUser";

export const GET = async (req: NextRequest) => {

  try {

    const clientID = getSearchParams(req, 'clientID')
    const cardID = getSearchParams(req, 'cardID')
    const session = await getAuth()
    if (!session) return unauthorizedRes()

    if (session.user.type === 'client') {
      const client = await prisma.client.findUnique({
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
      if (!client) return badRequestRes()

      return okayRes(client.cards)
    }

    const isAdmin = checkIsAdmin(session.user.type)
    if (!isAdmin) return unauthorizedRes()

    //retrieve single card
    if (cardID) {
      const card = await prisma.clientCard.findUnique({ where: { id: cardID } })
      if (!card) return notFoundRes('Client Card')
      return okayRes(card)
    }

    //return all cards of the client
    if (clientID) {

      const client = await prisma.client.findUnique({ where: { id: clientID }, include: { cards: true } })
      if (!client) return notFoundRes("Client")
      //return 404 resposne if not found 

      return okayRes(client.cards)
      //return client cards
    }

    return badRequestRes("Failed to get card")

  } catch (error) {
    console.log(error);
    return serverErrorRes(error)
  } finally {
    prisma.$disconnect()
  }
}

export const PATCH = async (req: NextRequest) => {

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

export const DELETE = async (req: NextRequest) => {

  const { searchParams } = new URL(req.url)
  const clientCardID = searchParams.get('clientCardID')

  try {

    if (clientCardID) {

      //retrieve card
      const card = await prisma.clientCard.findUnique({ where: { id: clientCardID } })
      if (!card) return notFoundRes('Card in Client')

      const unbindCard = await prisma.clientCard.delete({ where: { id: clientCardID } })
      if (!unbindCard) return badRequestRes()

      return okayRes()

    }

    if (!clientCardID) return notFoundRes('clientCardID')

  } catch (error) {
    console.log(error);
    return serverErrorRes(error)
  } finally {
    prisma.$disconnect()
  }

}