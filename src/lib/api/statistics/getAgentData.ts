import prisma from "@/lib/db";
import { AGENT } from "@/utils/constants";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

const getAgentData = async () => {
    const today = new Date();
    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfThisWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfPreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);

    // Fetch total number of agents
    const getTotalAgents = await prisma.agent.count();

    // Fetch total number of agents for this year
    const getTotalAgentsThisYear = await prisma.agent.count({
        where: {
            created_at: {
                gte: startOfThisYear,
                lte: today
            }
        }
    });

    // Fetch total number of agents for last year
    const getTotalAgentsLastYear = await prisma.agent.count({
        where: {
            created_at: {
                gte: startOfLastYear,
                lt: startOfThisYear
            }
        }
    });

    // Fetch total number of agents for this month
    const getTotalAgentsThisMonth = await prisma.agent.count({
        where: {
            created_at: {
                gte: startOfThisMonth,
                lte: today
            }
        }
    });

    // Fetch total number of agents for last month
    const getTotalAgentsLastMonth = await prisma.agent.count({
        where: {
            created_at: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        }
    });

    // Fetch total number of agents for this week
    const getTotalAgentsThisWeek = await prisma.agent.count({
        where: {
            created_at: {
                gte: startOfThisWeek,
                lte: today
            }
        }
    });

    // Fetch total number of agents for previous week
    const getTotalAgentsPreviousWeek = await prisma.agent.count({
        where: {
            created_at: {
                gte: startOfPreviousWeek,
                lt: startOfThisWeek
            }
        }
    });

    // Calculate percentage change for one year, one month, and one week
    const agentsChangePercentageOneYear = getTotalAgentsLastYear
        ? ((getTotalAgentsThisYear - getTotalAgentsLastYear) / getTotalAgentsLastYear) * 100
        : 0;

    const agentsChangePercentageOneMonth = getTotalAgentsLastMonth
        ? ((getTotalAgentsThisMonth - getTotalAgentsLastMonth) / getTotalAgentsLastMonth) * 100
        : 0;

    const agentsChangePercentageOneWeek = getTotalAgentsPreviousWeek
        ? ((getTotalAgentsThisWeek - getTotalAgentsPreviousWeek) / getTotalAgentsPreviousWeek) * 100
        : 0;

    return {
        icon: faUserSecret,
        name: AGENT,
        total: getTotalAgents,
        thisYear: getTotalAgentsThisYear,
        thisMonth: getTotalAgentsThisMonth,
        thisWeek: getTotalAgentsThisWeek,
        oneYearChange: agentsChangePercentageOneYear,
        oneMonthChange: agentsChangePercentageOneMonth,
        oneWeekChange: agentsChangePercentageOneWeek
    };
};

export { getAgentData };
