import { getNotionDatabase } from "./notion/client.ts";
import { LinearService } from "./linear/client.ts";

async function main() {
	const notionDatabaseId = process.env.NOTION_DATABASE_ID;
	if (!notionDatabaseId) {
		throw new Error("NOTION_DATABASE_ID is not set");
	}
	const teamName = process.env.NOTION_TEAM_NAME || "";
	if (!teamName) {
		throw new Error("NOTION_TEAM_NAME is not set");
	}
	const projectId = process.env.LINEAR_PROJECT_ID || "";
	if (!projectId) {
		throw new Error("LINEAR_PROJECT_ID is not set");
	}
	const linear = new LinearService();
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

		// NOTE:linearで0を許容しない設定にしてるので、0の場合はundefinedにする
		const storyPoint = page.properties["story point"]?.number || undefined;
		console.log(
			`移行します。→ title:${title} asigneeEmail:${asigneeEmail} status:${status} storyPoint:${storyPoint}`,
		);
		if (asigneeEmail === "") {
			const linearUser = await linear.getTeamMemberByEmail(asigneeEmail);
			await linear.createIssue({
				title: title,
				projectId: projectId,
				assigneeId: linearUser?.id, // undefinedの場合はエラーになる。。TODO
				storyPoint: storyPoint,
			});
			console.log(`title：${title} を移行しました。`);
			continue;
		}
		await linear.createIssue({
			title: title,
			projectId: projectId,
			assigneeId: undefined, // undefinedの場合はエラーになる。。TODO
			storyPoint: storyPoint,
		});
		console.log(`title：${title} を移行しました。`);
		console.log("--------------------------------");
	}

	console.log(`${teamTasks.results.length}件のタスクを移行しました。`);
}

// NOTE: 移行実行
// main().catch(console.error);

async function getLinearInfo() {
	const linear = new LinearService();
	// NOTE: チーム一覧を取得する
	const teams = await linear.listTeams();
	for (const team of teams.nodes) {
		console.log(`Name: ${team.name}, ID: ${team.id}`);
	}
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
}

// NOTE: linearの環境変数を取得する用途
// getLinearInfo().catch(console.error);
