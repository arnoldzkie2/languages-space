import prisma from "../../../../prisma/prisma"

interface UserProps {
    email: string
    name: string
}
export const POST = async (req: Request) => {
    const { email, name }: UserProps = await req.json()

    try {
        if (!email || !name) return new Response(JSON.stringify({ success: false, data: null, message: 'Email or name cannot be empty' }))
        const existingUser = await prisma.user.findMany({
            where: {
                email: email
            }
        })
        if (existingUser) return new Response(JSON.stringify({ success: true, data: { email: email, name: name }, message: 'Email already exis!' }), { status: 200 })
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name
            }
        })
        new Response(JSON.stringify({success: true, data: newUser}), {status: 200})
    } catch (error) {
        console.log(error);

    }
}