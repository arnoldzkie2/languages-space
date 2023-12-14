import prisma from "@/lib/db";
import { notFoundRes, badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { UTApi } from "uploadthing/server";

interface Props {
    profile: {
        key: string
        url: string
    }
    supplierID: string
}


export const POST = async (req: Request) => {

    const { profile, supplierID }: Props = await req.json()

    try {

        const utapi = new UTApi()

        if (supplierID) {

            const supplier = await prisma.supplier.findUnique({ where: { id: supplierID } })
            if (!supplier) return notFoundRes('Supplier')

            if (supplier.profile_key) {
                const deleteProfile = await utapi.deleteFiles(supplier.profile_key)
                if (!deleteProfile) return badRequestRes()
            }

            const updateSupplierProfile = await prisma.supplier.update({
                where: { id: supplier.id }, data: { profile_key: profile.key, profile_url: profile.url }
            })
            if (!updateSupplierProfile) return badRequestRes()

            return okayRes()

        }

        return notFoundRes('Client')

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}