import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {

    const { name, user_name, password, organization, payment_information, phone_number, email, address, gender, card, origin,
        tags, note, employment_status, entry, departure, departments, meeting_info } = await req.json()

    try {

        const existingUsername =
            await prisma.client.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.superAdmin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.admin.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.supplier.findUnique({ where: { user_name: String(user_name) } }) ||
            await prisma.agent.findUnique({ where: { user_name: String(user_name) } })

        if (existingUsername) return NextResponse.json({ success: false, data: { user_name: user_name }, message: 'Username already exist!' }, { status: 409 })

        const checkEmail = await prisma.supplier.findFirst({
            where: { email }
        })

        if (checkEmail) return NextResponse.json({ success: false, error: true, message: 'Email already exist!' }, { status: 200 })

        if (departments && Array.isArray(departments)) {
            const nonExistentDepartments = await Promise.all(
                departments.map(async (departmentId) => {
                    const checkDepartment = await prisma.department.findUnique({
                        where: {
                            id: departmentId,
                        },
                    });
                    return { id: departmentId, exists: Boolean(checkDepartment) };
                })
            );

            const nonExistentDepartmentsList = nonExistentDepartments.filter(
                (department) => !department.exists
            );

            if (nonExistentDepartmentsList.length > 0) {
                const nonExistentDepartmentIds = nonExistentDepartmentsList.map(
                    (department) => department.id
                );
                return NextResponse.json({
                    success: false,
                    error: true,
                    message: `Departments with IDs [${nonExistentDepartmentIds.join(
                        ', '
                    )}] do not exist`,
                }, { status: 404 });
            }
        }

        const newSupplier = await prisma.supplier.create({
            data: {
                name, user_name, password, organization, payment_information, phone_number, email, address, gender, card,
                origin, tags, note, employment_status, entry, departure, departments, meeting_info
            }
        })

        if (!newSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error!' }, { status: 500 })

        return NextResponse.json({ success: true, data: newSupplier }, { status: 200 })

    } catch (error) {

        console.log(error);

    }

}

export const GET = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        if (id) {

            const singleSupplier = await prisma.supplier.findUnique({
                where: { id }
            })

            if (!singleSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

            return NextResponse.json({ success: true, data: singleSupplier }, { status: 200 })

        }

        const allSupplier = await prisma.supplier.findMany()

        if (!allSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 200 })

        return NextResponse.json({ success: true, data: allSupplier }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}

export const PATCH = async (req: Request) => {

    const { name, profile, user_name, password, organization, payment_information, phone_number, email, address, gender,
        card, origin, tags, note, employment_status, entry, departure, departments, meeting_info } = await req.json()

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const checkId = await prisma.supplier.findFirst({
            where: { id: String(id) }
        })

        if (!checkId) return NextResponse.json({ success: false, error: true, message: 'No id found' }, { status: 404 })

        if (departments && Array.isArray(departments)) {
            const nonExistentDepartments = await Promise.all(
                departments.map(async (departmentId) => {
                    const checkDepartment = await prisma.department.findUnique({
                        where: {
                            id: departmentId,
                        },
                    });
                    return { id: departmentId, exists: Boolean(checkDepartment) };
                })
            );

            const nonExistentDepartmentsList = nonExistentDepartments.filter(
                (department) => !department.exists
            );

            if (nonExistentDepartmentsList.length > 0) {
                const nonExistentDepartmentIds = nonExistentDepartmentsList.map(
                    (department) => department.id
                );
                return NextResponse.json({
                    success: false,
                    error: true,
                    message: `Departments with IDs [${nonExistentDepartmentIds.join(
                        ', '
                    )}] do not exist`,
                }, { status: 404 });
            }
        }

        const updatedSupplier = await prisma.supplier.update({
            where: { id: String(id) }, data: {
                name, profile, user_name, password, organization, payment_information, phone_number, email, address, gender,
                card, origin, tags, note, employment_status, entry, departure, meeting_info, departments
            }
        })

        if (!updatedSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: updatedSupplier }, { status: 200 })

    } catch (error) {

        console.log(error);

    }
}

export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url)

    const id = searchParams.get('id')

    try {

        const deletedSupplier = await prisma.supplier.delete({
            where: { id: String(id) }
        })

        if (!deletedSupplier) return NextResponse.json({ success: false, error: true, message: 'Server error' }, { status: 500 })

        return NextResponse.json({ success: true, data: deletedSupplier, message: 'Deleted this supplier' }, { status: 200 })


    } catch (error) {

        console.log(error);

    }
}



