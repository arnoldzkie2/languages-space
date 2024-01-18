import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { badRequestRes, createdRes, existRes, getSearchParams, notFoundRes, okayRes, serverErrorRes, unauthorizedRes } from "@/utils/apiResponse";
import { getAuth } from "@/lib/nextAuth";
import { checkIsAdmin, checkUsername } from "@/utils/checkUser";
import { AGENT } from "@/utils/constants";

export const GET = async (req: NextRequest) => {

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only admin are allowed to proceed

        const departmentID = getSearchParams(req, 'departmentID')
        const agentID = getSearchParams(req, 'agentID')

        if (departmentID) {

            //check department and get all agents in this department
            const department = await prisma.department.findUnique({
                where: {
                    id: departmentID
                },
                select: {
                    agents: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            organization: true,
                            origin: true,
                            note: true,
                            created_at: true
                        },
                        orderBy: {
                            created_at: 'desc'
                        }
                    }
                }
            })
            //return 404 if department not found
            if (!department) return notFoundRes("Department")
            //return 200 response and pass the agents as data            
            return okayRes(department.agents)
        }

        if (agentID) {

            //retrieve agent
            const agent = await prisma.agent.findUnique({
                where: { id: agentID },
                include: {
                    departments: true,
                    balance: true
                }
            })

            //return agent if not found
            if (!agent) return notFoundRes("Agent")

            return okayRes(agent)
            //return 200 response
        }

        //get all agents
        const allAgents = await prisma.agent.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                organization: true,
                origin: true,
                note: true,
                created_at: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })
        //return 400 response if it fails
        if (!allAgents) return badRequestRes("Failed to get all agents")

        return okayRes(allAgents)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


export const POST = async (req: Request) => {

    const { name, organization, username, password,
        phone_number, email, address, gender, origin,
        note, departments, currency, payment_address, commission_rate,
        commission_type, profile_key, profile_url } = await req.json()

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only admin and superadmin are allowed here

        //check if username exist in all users
        const isUsernameExist = await checkUsername(username)
        if (isUsernameExist) return existRes("Username")

        //create a new agent
        const newAgent = await prisma.agent.create({
            data: {
                name, password, username, organization, phone_number,
                email, address, gender, origin, note, profile_key, profile_url,
                //we create the agent balance here
                balance: {
                    create: {
                        amount: 0,
                        currency,
                        commission_rate: Number(commission_rate),
                        commission_type,
                        payment_address
                    }
                }
            }
        })
        if (!newAgent) return badRequestRes("Failed to create agent")

        //this will connect the agent to department
        if (departments && departments.length > 0) {

            const checkDepartments = await prisma.department.findMany({
                where: {
                    id: {
                        in: departments
                    }
                }
            })
            //check all existing departments
            const existingDepartmentIds = checkDepartments.map(department => department.id);
            const nonExistingDepartmentIds = departments.filter((id: string) => !existingDepartmentIds.includes(id));
            //check if somedepartment does not exist in database
            if (nonExistingDepartmentIds.length > 0) return NextResponse.json({ msg: `Departments with IDs ${nonExistingDepartmentIds.join(',')} not found` }, { status: 404 });

            //update the agent and connect all departments
            const updateAgentDepartment = await prisma.agent.update({
                where: { id: newAgent.id }, data: {
                    departments: {
                        connect: departments.map((id: string) => ({ id }))
                    }
                }
            })
            //return 400 response if it fails to connect
            if (!updateAgentDepartment) return badRequestRes("Failed to connect department to agent")
        }

        //return 201 response 
        return createdRes()

    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


export const PATCH = async (req: Request) => {

    try {
        //get all data
        const { name, username, password, organization, payment_address, phone_number, email, address, gender, profile_key, profile_url,
            origin, note, departments, currency, commission_rate, commission_type } = await req.json()

        const { searchParams } = new URL(req.url)
        const agentID = searchParams.get('agentID')

        const session = await getAuth()
        if (!session) return unauthorizedRes()

        //if user type is agent proceed
        if (session.user.type === AGENT) {

            if (session.user.username !== username && username) {
                //check if username exist
                const isUsernameExist = await checkUsername(username)
                if (isUsernameExist) return existRes("Username")
            }

            //check if agent exist
            const agent = await prisma.agent.findUnique({
                where: { id: session.user.id },
                include: { balance: true }
            })
            if (!agent) return notFoundRes(AGENT)
            //return 404 response if agent does not exist

            const updateAgent = await prisma.agent.update({
                where: { id: session.user.id }, data: {
                    name, username, password, email, phone_number, address, gender
                }
            })
            if (!updateAgent) return badRequestRes("F")

            //if payment address changed update the agentbalance
            if (payment_address) {
                const updatePaymentInfo = await prisma.agentBalance.update({
                    where: {
                        id: agent.balance[0].id
                    }, data: { payment_address }
                })
                if (!updatePaymentInfo) return badRequestRes("Failed to update payment address to agent")
                //return 400 response if it fails
            }

            return okayRes()
            //return 200 response
        }

        //only allow admin to proceed 
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()

        //if agentID exist proceed here
        if (agentID) {

            //retrieve the agent 
            const agent = await prisma.agent.findUnique({
                where: { id: agentID },
                include: { departments: true, balance: true }
            })
            if (!agent) return notFoundRes(AGENT)


            if (agent.username !== username) {
                const isUsernameExist = await checkUsername(username)
                if (isUsernameExist) return existRes("Username")
            }

            const updatedSupplier = await prisma.agent.update({
                where: { id: agentID },
                data: {
                    name, username, password, organization, phone_number, email, address, gender,
                    origin, note, profile_key, profile_url,
                    balance: {
                        update: {
                            where: { id: agent.balance[0].id },
                            data: {
                                payment_address,
                                currency,
                                commission_type,
                                commission_rate: Number(commission_rate)
                            }
                        }
                    },
                }
            })
            if (!updatedSupplier) return badRequestRes('Faild to update  agent')
            //return 400 response if it fails

            if (departments && departments.length > 0) {

                const departmentsToConnect = departments.map((departmentId: string) => ({ id: departmentId }));

                const departmentsToRemove = agent.departments.filter((department) =>
                    !departmentsToConnect.some((newDepartment: any) => newDepartment.id === department.id)
                )

                const updateAgentDepartment = await prisma.agent.update({
                    where: { id: agentID },
                    data: {
                        departments: { connect: departmentsToConnect, disconnect: departmentsToRemove },
                    }
                })
                if (!updateAgentDepartment) return badRequestRes("Failed to update agent")
                //return 400 response if it fails to update

            }

            return okayRes()
            //return 200 response
        }

        return notFoundRes(AGENT)
        //return 400 response if agentID not passed
    } catch (error) {
        console.log(error);
        return serverErrorRes(error)
    } finally {
        prisma.$disconnect()
    }
}


export const DELETE = async (req: Request) => {

    const { searchParams } = new URL(req.url);
    //get all agentID
    const agentIDS = searchParams.getAll('agentID');

    try {

        const session = await getAuth()
        if (!session) return unauthorizedRes()
        const isAdmin = checkIsAdmin(session.user.type)
        if (!isAdmin) return unauthorizedRes()
        //only allow admin to proceed
        if (agentIDS.length > 0) {

            //delete agents
            const deleteAgents = await prisma.agent.deleteMany({
                where: { id: { in: agentIDS } },
            })
            if (deleteAgents.count === 0) return notFoundRes(AGENT)

            //return 200 response
            return okayRes()
        }

        //return 404 response
        return notFoundRes(AGENT)

    } catch (error) {
        console.log(error);
        return serverErrorRes(error);
    } finally {
        prisma.$disconnect();
    }
}