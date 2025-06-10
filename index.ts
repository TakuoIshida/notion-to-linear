import { getNotionDatabase } from "./notion/client.ts";
import { LinearService } from "./linear/client.ts";

async function main() {
	const notionDatabaseId = process.env.NOTION_DATABASE_ID;
	if (!notionDatabaseId) {
		throw new Error("NOTION_DATABASE_ID is not set");
	}
	const linear = new LinearService();
	const teamName = "cactus";
	const teamTasks = await getNotionDatabase(notionDatabaseId, teamName);

	console.log(`${teamTasks.results.length}件のタスクを移行します。`);

	for (const page of teamTasks.results) {
		if (!("properties" in page)) continue;
		console.log("page.properties", page.properties);
		// NOTE: notionのpropertyにはtypeがないのでこれでOK。
		// notionのdatabaseカラムに設定してるproperty名に合わせて変更すること。
		const title = page.properties["title"].title[0].plain_text;
		const asigneeEmail =
			page.properties["担当者"].people[0]?.person?.email || "";
		const status = page.properties["ステータス"].status?.name || "";
		const storyPoint = page.properties["story point"]?.number || 0;
		console.log(
			`移行します。→ title:${title} asigneeEmail:${asigneeEmail} status:${status} storyPoint:${storyPoint}`,
		);

		// const linearUser = await linear.getTeamMemberByEmail(asigneeEmail);
		// console.log("linearUser", linearUser);

		// await linear.createIssue({
		// 	title: "移行するチケット",
		// 	projectId: "df23595c7f5b",
		// 	assigneeId: linearUser?.id,
		// 	storyPoint: 1,
		// 	description: "hogehoge",
		// });
		// console.log(`タイトル：${title} を移行しました。`);
		// console.log("--------------------------------");
	}

	// NOTE: チーム一覧を取得する
	// const teams = await linear.listTeams();
	// for (const team of teams.nodes) {
	// 	console.log(`Name: ${team.name}, ID: ${team.id}`);
	// }
	// NOTE: チームのissue一覧を取得する
	// const issues = await linear.listTeamIssues();
	// for (const issue of issues.nodes) {
	// 	console.log(`ID: ${issue.id}, Title: ${issue.title}`);
	// }
	// NOTE: チームのプロジェクト一覧を取得する
	const projects = await linear.listProjects();
	for (const project of projects.nodes) {
		console.log(`ID: ${project.id}, Name: ${project.name}`);
	}
	console.log(`${teamTasks.results.length}件のタスクを移行しました。`);
}

main().catch(console.error);
