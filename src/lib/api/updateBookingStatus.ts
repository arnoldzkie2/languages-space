import { COMPLETED, CONFIRMED, FINGERPOWER } from "@/utils/constants"
import prisma from "../db"

const checkBookingAndUpdateStatus = async () => {

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    //get allbooking with this condition
    // *all - status: confirmed,departmentName not fingerpower
    // schedule Date is yesterday or past
    //schedule date is today and time is currentTime or past
    await prisma.booking.updateMany({
        where: {
            status: CONFIRMED,
            department: {
                NOT: {
                    name: FINGERPOWER
                }
            },
            OR: [
                {
                    schedule: {
                        date: {
                            lt: currentDate
                        }
                    }
                },
                {
                    AND: [
                        {
                            schedule: {
                                date: currentDate
                            }
                        },
                        {
                            schedule: {
                                time: {
                                    lte: currentTime
                                }
                            }
                        }
                    ]
                }
            ]
        },
        data: {
            status: COMPLETED
        }
    })

}

export { checkBookingAndUpdateStatus }