import prisma from "@/lib/db"
import { getAuth } from "@/lib/nextAuth"
import { badRequestRes, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse"

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientCardID = searchParams.get('clientCardID')

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        if (session.user.type === 'client') {

            if (clientCardID) {
                const clientCard = await prisma.clientCard.findUnique({
                    where: { id: clientCardID, clientID: session.user.id },
                    select: {
                        card: {
                            select: {
                                supported_suppliers: {
                                    select: {
                                        price: true,
                                        supplier: {
                                            select: {
                                                id: true,
                                                tags: true,
                                                name: true,
                                                meeting_info: {
                                                    select: {
                                                        id: true
                                                    }
                                                },
                                                profile_url: true
                                            },
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                if (!clientCard) return notFoundRes('Card');

                const supportedSuppliers = clientCard.card.supported_suppliers;

                const suppliersWithMeetingInfo = supportedSuppliers.filter(
                    (supplier) => supplier.supplier.meeting_info && supplier.supplier.meeting_info.length > 0
                );

                return okayRes(suppliersWithMeetingInfo);
            }

            return notFoundRes('Card')

        }

        return badRequestRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}