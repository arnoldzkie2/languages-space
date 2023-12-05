import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import prisma from "@/lib/db";


export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)
    const supplierID = searchParams.get('supplierID')
    const departmentID = searchParams.get('departmentID')

    try {

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: { meeting_info: true }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.meeting_info)
        }

        if (departmentID) {

            const department = await prisma.department.findUnique({
                where: { id: departmentID }, select: {
                    suppliers: {
                        where: {
                            meeting_info: { some: {} }
                        }
                    }
                }
            })
            if (!department) return notFoundRes('Department')

            return okayRes(department.suppliers)
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
