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
		this.client = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });
		this.teamId = process.env.LINEAR_TEAM_ID ?? "";
	}

	/**
	 * チーム一覧を取得する
	 */
	async listTeams() {
		return await this.client.teams();
	}

	async listTeamIssues() {
		return await this.client.issues({
			filter: {
				team: {
					id: { eq: this.teamId },
				},
			},
		});
	}
}
