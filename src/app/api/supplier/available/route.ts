import prisma from "@/lib/db"
import { notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse"

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const clientCardID = searchParams.get('clientCardID')

    try {

        if (clientCardID) {

            const today = new Date();  // Get the current date and time in UTC

            const formattedToday = today.toISOString().split('T')[0];  // Format the date as "YYYY-MM-DD"
            const formattedCurrentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getUTCMinutes().toString().padStart(2, '0')}`;  // Format the time as "HH:mm"

            if (clientCardID) {

                const clientCard = await prisma.clientCard.findUnique({
                    where: {
                        id: clientCardID,
                    },
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
                                                profile_url: true,
                                                meeting_info: {
                                                    select: {
                                                        id: true
                                                    }
                                                },
                                                schedule: {
                                                    select: {
                                                        id: true
                                                    },
                                                    where: {
                                                        status: 'available',
                                                        date: { gte: formattedToday },
                                                        time: { gte: formattedCurrentTime },
                                                        NOT: {
                                                            AND: [
                                                                { date: formattedToday },
                                                                { time: formattedCurrentTime }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                        }
                                    }
                                }
                            }
                        }
                    },
                });


                if (!clientCard) return notFoundRes('Card');

                const supportedSuppliers = clientCard.card.supported_suppliers;

                //filter the supplier
                const filterSupplier = supportedSuppliers
                    .filter((supplier) => supplier.supplier.meeting_info && supplier.supplier.meeting_info.length > 0 &&
                        supplier.supplier.schedule.length > 0)
                    .map((supplier) => ({
                        // Copy all properties from the original supplier except the 'schedule' property
                        ...supplier,
                        supplier: {
                            ...supplier.supplier,
                            meeting_info: undefined,
                            schedule: undefined, // Remove the 'schedule' property
                        },
                    }));


                return okayRes(filterSupplier);
            }

            return notFoundRes('Card')
        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }

}