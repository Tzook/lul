import { Octokit } from "@octokit/rest";
import { getEnvVariable } from "../main/env";
import MasterServices from "../master/master.services";

export default class GithubServices extends MasterServices {}

const octokit = new Octokit({
    auth: getEnvVariable("githubToken"),
});

export async function createIssue({ body, name }: { body: string; name: string }) {
    const title = body.length > 35 ? `${body.slice(0, 32)}...` : body;
    await octokit.issues.create({
        owner: "Tzook",
        repo: "lel",
        title: `[Bug] ${title} (by ${name})`,
        body: `User's description:\n${body}`,
        labels: ["user bug", "bug"],
    });
}
