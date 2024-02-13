import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getAgentWithMostInvitesLastMOnth = async ({ startOfLastMonth, endOfLastMonth }: DashboardDateType) => {
    // Fetch the agent with the most invites last month
    const agentWithMostInvitesLastMonth = await prisma.agent.findFirst({
        orderBy: {
            invites: {
                _count: 'desc'
            }
        },
        where: {
            invites: {
                some: {
                    created_at: {
                        gte: startOfLastMonth,
                        lt: endOfLastMonth
                    }
                }
            }
        },
        select: {
            id: true,
            profile_url: true,
            username: true,
            email: true,
            invites: true
        }
    });
    if (!agentWithMostInvitesLastMonth) return null

    const totalInvitesOfAgentWithMostInvitesLastMonth = agentWithMostInvitesLastMonth.invites.length;

    return {
        id: agentWithMostInvitesLastMonth.id,
        profile_url: agentWithMostInvitesLastMonth.profile_url,
        username: agentWithMostInvitesLastMonth.username,
        email: agentWithMostInvitesLastMonth.email,
        total_invites: totalInvitesOfAgentWithMostInvitesLastMonth
    };
}

