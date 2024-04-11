import { badRequestRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { exec } from "child_process";

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();

        // Array of repository names you want to monitor and update
        const repositories = ["languages-space", "verbalace", "fingerpower"];

        // Extract relevant information from the webhook payload
        const repositoryName = data.repository.name;
        const branch = data.ref.split("/").pop(); // Extract branch name from ref

        if (repositories.includes(repositoryName) && branch === 'main') {
            // Change directory to the repository's directory
            const repoDirectory = `/var/www/${repositoryName}/${repositoryName}`;
            
            // Execute commands using && to chain them together
            exec(`sudo chown -R root:root ${repoDirectory} && cd ${repoDirectory} && git pull && npm install && npm install && npm run build && pm2 restart ${repositoryName}`, (error, stdout) => {
                if (error) {
                    console.error(`Error executing commands: ${error}`);
                    return serverErrorRes(error);
                } else {
                    console.log(`Commands executed successfully: ${stdout}`);
                    return okayRes(repositoryName);
                }
            });
        }

        return badRequestRes();
        
    } catch (error) {
        console.error(error);
        return serverErrorRes(error);
    }
};
