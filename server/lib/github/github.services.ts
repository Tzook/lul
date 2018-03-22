
import MasterServices from '../master/master.services';
import { getServices } from '../main/bootstrap';
import { getEnvVariable } from '../main/main';
import * as Octokit from "@octokit/rest";

export default class GithubServices extends MasterServices {
    public githubClient: Octokit;
};

function getGithubServices(): GithubServices {
    return getServices("github");
}

function getGithubClient() {
    const services = getGithubServices();
    if (!services.githubClient) {
        services.githubClient = new Octokit();
        services.githubClient.authenticate({
            type: "token",
            token: getEnvVariable("githubToken")
        });
    }
    return services.githubClient;
}

export function createIssue({body, name}: {body: string, name: string}) {
    const title = body.length > 35 ? `${body.slice(0, 32)}...` : body;
    const client = getGithubClient();
    return client.issues.create({
        owner: "Tzook", 
        repo: "lel", 
        title: `[Bug] ${title} (by ${name})`,
        body: `User's description:\n${body}`,
        labels: ["user bug"]
    }).then(() => {});
}