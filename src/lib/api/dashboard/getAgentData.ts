import prisma from "@/lib/db";
import { notFoundRes } from "@/utils/apiResponse";

const getAgentData = async () => {

    const agentWithMostInvites = await prisma.agent.findFirst({
        orderBy: {
            invites: {
                _count: 'desc'
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
    if (!agentWithMostInvites) return notFoundRes("Failed to get agent with most invites");

    const totalInvitesOfAgentWithMostInvites = agentWithMostInvites.invites.length;
    const formattedAgentWithMostInvites = {
        id: agentWithMostInvites.id,
        profile_url: agentWithMostInvites.profile_url,
        username: agentWithMostInvites.username,
        email: agentWithMostInvites.email,
        total_invites: totalInvitesOfAgentWithMostInvites
    };
    
}

export { getAgentData }