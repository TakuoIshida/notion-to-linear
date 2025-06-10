import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Linear APIを操作するサービスクラス
 */
export class LinearService {
	private client: LinearClient;
	private teamId: string;

	constructor() {
		if (!process.env.LINEAR_API_KEY) {
			throw new Error("LINEAR_API_KEY is not set");
		}
		if (!process.env.LINEAR_TEAM_ID) {
			throw new Error("LINEAR_TEAM_ID is not set");
		}
		this.client = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });
		this.teamId = process.env.LINEAR_TEAM_ID ?? "";
	}

	/**
	 * チーム一覧を取得する
	 */
	async listTeams() {
		return await this.client.teams();
	}

	/**
	 * チームのissue一覧を取得する
	 */
	async listTeamIssues() {
		return await this.client.issues({
			filter: {
				team: {
					id: { eq: this.teamId },
				},
			},
		});
	}

	/**
	 * チームメンバーのIDを取得する
	 * @param email メールアドレス
	 * @returns チームメンバーのID
	 */
	async getTeamMemberByEmail(email: string) {
		const user = await this.client.users({
			filter: {
				email: {
					eq: email,
				},
			},
			first: 1,
		});
		console.log("getTeamMemberByEmail", user);
		return user.nodes[0];
	}

	async listProjects() {
		return await this.client.projects({ first: 100 });
	}

	/**
	 * タスクを作成する
	 * @param input タスク作成の入力
	 */
	async createIssue(input: {
		title: string;
		projectId: string;
		description: string;
		assigneeId?: string;
		storyPoint: number;
	}) {
		return await this.client.createIssue({
			teamId: this.teamId,
			title: input.title,
			projectId: input.projectId,
			description: input.description,
			assigneeId: input.assigneeId,
			estimate: input.storyPoint,
		});
	}
}
