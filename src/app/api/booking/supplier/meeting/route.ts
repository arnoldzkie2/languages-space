import prisma from "@/lib/db";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    const departmentID = getSearchParams(req, 'departmentID')
    const supplierID = getSearchParams(req, 'supplierID')

    try {

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                select: {
                    meeting_info: {
                        select: { id: true, service: true, meeting_code: true }
                    }
                }
            })
            if (!supplier) return notFoundRes('Supplier')

            return okayRes(supplier.meeting_info)
        }

        if (departmentID) {

            //get all the supplier in department that has meeting info
            const department = await prisma.department.findUnique({
                where: { id: departmentID },
                select: {
                    suppliers: {
                        select: { id: true, name: true },
                        where: { meeting_info: { some: {} } }
                    }
                }
            })
            if (!department) return notFoundRes('Department')

            return okayRes(department.suppliers)
        }

        const suppliers = await prisma.supplier.findMany({
            where: { meeting_info: { some: {} } },
            select: { id: true, name: true }
        })
        if (!suppliers) return badRequestRes()

        return okayRes(suppliers)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}