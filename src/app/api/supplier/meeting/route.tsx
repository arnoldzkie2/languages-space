import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/utils/apiResponse";
import prisma from "@/lib/db";


export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (supplierID) {

            const supplierSchedule = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: { meeting_info: true }
            })
            if (!supplierSchedule) return notFoundRes('Supplier')

            return okayRes(supplierSchedule.meeting_info)
        }

        if (departmentID) {

            const allSupplier = await prisma.supplier.findMany({
                where: { departments: { some: { id: departmentID } }, meeting_info: { some: {} } }
            })
            if (!allSupplier) return badRequestRes()

            return okayRes(allSupplier)
        }

        const allSupplier = await prisma.supplier.findMany({
            where: { meeting_info: { some: {} } }
        })
        if (!allSupplier) return badRequestRes()

        return okayRes(allSupplier)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}
