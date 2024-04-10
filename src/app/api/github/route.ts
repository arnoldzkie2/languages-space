import { badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { exec } from "child_process"; // Import the 'exec' function to execute shell commands

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();

        // Array of repository names you want to monitor and update
        const repositories = ["languages-space", "verbalace", "fingerpower"];

        // Extract relevant information from the webhook payload
        const repositoryName = data.repository.name;
        const branch = data.ref.split("/").pop(); // Extract branch name from ref

        //test
        // Check if the updated repository matches any of the repositories you're interested in
        if (repositories.includes(repositoryName) && branch === 'main') {
            // Change directory to the repository's directory
            const repoDirectory = `/var/www/${repositoryName}/${repositoryName}`
            exec(
                `cd ${repoDirectory} && git pull && npm i && npm run build && pm2 restart ${repositoryName}`,
                (error, stdout) => {
                    if (error) {
                        console.error(`Error executing commands: ${error}`);
                        return serverErrorRes("Error executing commands");
                    }
                    console.log(`Command output: ${stdout}`);
                    // Respond with success if everything completes without errors
                    return okayRes(repositoryName)
                }
            );
            return okayRes()
        }

        return badRequestRes()
    } catch (error) {
        console.error(error);
        return serverErrorRes(error);
    }
};
