import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, notFoundRes, okayRes, serverErrorRes } from "@/lib/api/response";

export const POST = async (req: Request) => {

    const { name, user_name, password, organization, payment_info, phone_number, email, address, gender, card, origin,
        tags, note, employment_status, entry, departure, departments, meeting_info } = await req.json()

    try {

        if (!user_name || !password || !name) return badRequestRes()

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name } }) ||
            await prisma.admin.findUnique({ where: { user_name } }) ||
            await prisma.supplier.findUnique({ where: { user_name } }) ||
            await prisma.agent.findUnique({ where: { user_name } })

        if (existingUsername) return existRes('user_name')

        const supplierData = {
            name, user_name, password, organization, payment_info, phone_number, email, address, gender, card, origin, tags, note, employment_status, entry, departure,
        }

        if (departments && departments.length > 0) {

            const checkDepartments = await prisma.department.findMany({
                where: {
                    id: {
                        in: departments
                    }
                }
            })

            const existingDepartmentIds = checkDepartments.map(department => department.id);
            const nonExistingDepartmentIds = departments.filter((id: string) => !existingDepartmentIds.includes(id));

            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 400 });

            const newSupplier = await prisma.supplier.create({
                data: supplierData,
            });

            if (!newSupplier) return badRequestRes()

            return createdRes()

        }

        const newSupplier = await prisma.supplier.create({
            data: supplierData,
        })

        if (!newSupplier) return badRequestRes()

        return createdRes()

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const supplierID = searchParams.get('supplierID')

    const departmentID = searchParams.get('departmentID')

    try {

        if (supplierID) {

            const singleSupplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                include: { departments: true, meeting_info: true }
            })

            if (!singleSupplier) notFoundRes('Supplier')

            return NextResponse.json({ ok: true, data: singleSupplier }, { status: 200 })

        }

        if (departmentID) {

            const suppliers = await prisma.supplier.findMany({
                where: {
                    departments: {
                        some: {
                            id: departmentID
                        }
                    }
                }, include: { departments: true }
            })

            if (!suppliers) return badRequestRes()

            return okayRes(suppliers)

        }

        const allSupplier = await prisma.supplier.findMany({ include: { departments: true } })

        if (!allSupplier) badRequestRes()

        return okayRes(allSupplier)

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    }
}

export const PATCH = async (req: Request) => {

    const { name, profile, user_name, password, organization, payment_info, phone_number, email, address, gender,
        card, origin, tags, note, employment_status, entry, departure, departments, meeting_info } = await req.json()

    const { searchParams } = new URL(req.url)

    const supplierID = searchParams.get('supplierID')

    try {

        if (supplierID) {

            const checkSupplier = await prisma.supplier.findUnique({
                where: { id: supplierID },
                include: { departments: true }
            })

            if (!checkSupplier) return notFoundRes('Supplier')

            const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));

            const departmentsToRemove = checkSupplier.departments.filter((department) =>
                !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
            );

            const updatedSupplier = await prisma.supplier.update({
                where: { id: supplierID }, data: {
                    name, profile, user_name, password, organization, payment_info, phone_number, email, address, gender,
                    card, origin, tags, note, employment_status, entry, departure, meeting_info,
                    departments: { connect: departmentsToConnect, disconnect: departmentsToRemove }
                },
                include: { departments: true }
            })

            if (!updatedSupplier) return badRequestRes()

            return NextResponse.json({ ok: true, data: updatedSupplier }, { status: 200 })

        }

        return notFoundRes('supplierID')

    } catch (error) {

        console.log(error);

        return serverErrorRes()

    } finally {

        prisma.$disconnect()
    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);

    const ids = searchParams.getAll('id');

    try {

        if (ids.length > 0) {

            const deleteSupplier = await prisma.supplier.deleteMany({

                where: { id: { in: ids } },

            })

            if (deleteSupplier.count === 0) return notFoundRes('Supplier')

            return NextResponse.json({ ok: true, count: deleteSupplier.count }, { status: 200 });

        }

        return notFoundRes('Supplier')

    } catch (error) {

        console.log(error);

        return serverErrorRes();

    } finally {

        prisma.$disconnect();
    }
}




