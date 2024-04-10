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

        // Check if the updated repository matches any of the repositories you're interested in
        if (repositories.includes(repositoryName) && branch === 'main') {
            // Change directory to the repository's directory
            const repoDirectory = `/var/www/${repositoryName}/${repositoryName}`;
            
            const commands = [
                `cd ${repoDirectory}`,
                'git pull',
                'npm install',
                'npm run build',
                `pm2 restart ${repositoryName}`
            ];

            // Execute commands one by one
            for (const command of commands) {
                await executeCommand(command);
            }

            // Respond with success if all commands complete without errors
            return okayRes(repositoryName);
        }

        return badRequestRes();
    } catch (error) {
        console.error(error);
        return serverErrorRes(error);
    }
};

// Function to execute a shell command
const executeCommand = (command: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command '${command}': ${error}`);
                reject(error);
            } else {
                console.log(`Command output for '${command}': ${stdout}`);
                resolve();
            }
        });
    });
};
