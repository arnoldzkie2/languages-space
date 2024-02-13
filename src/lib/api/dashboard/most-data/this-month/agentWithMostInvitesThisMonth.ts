import { DashboardDateType } from "@/app/api/overview/route";
import prisma from "@/lib/db";

export const getAgentWithMostInvitesThisMonth = async ({ startOfMonth, endOfMonth }: DashboardDateType) => {
    // Fetch the agent with the most invites this month
    const agentWithMostInvitesThisMonth = await prisma.agent.findFirst({
        orderBy: {
            invites: {
                _count: 'desc'
            }
        },
        where: {
            invites: {
                some: {
                    created_at: {
                        gte: startOfMonth,
                        lt: endOfMonth
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

    if (!agentWithMostInvitesThisMonth) return null;

    const totalInvitesOfAgentWithMostInvitesThisMonth = agentWithMostInvitesThisMonth.invites.length;

    return {
        id: agentWithMostInvitesThisMonth.id,
        profile_url: agentWithMostInvitesThisMonth.profile_url,
        username: agentWithMostInvitesThisMonth.username,
        email: agentWithMostInvitesThisMonth.email,
        total_invites: totalInvitesOfAgentWithMostInvitesThisMonth
    };
};
