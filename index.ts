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

	for (const page of teamTasks.results) {
		if (!("properties" in page)) continue;
		console.log("page.properties", page.properties);
		// NOTE: notionのpropertyにはtypeがないのでこれでOK。
		// notionのdatabaseカラムに設定してるproperty名に合わせて変更すること。
		const title = page.properties["title"].title[0].plain_text;
		const asigneeEmail = page.properties["担当者"].people[0].person.email;
		const status = page.properties["ステータス"].status.name;
		const storyPoint = page.properties["story point"].number;
		console.log(
			`title:${title} asigneeEmail:${asigneeEmail} status:${status} storyPoint:${storyPoint}`,
		);
	}

	const teams = await linear.listTeams();
	for (const team of teams.nodes) {
		console.log(`Name: ${team.name}, ID: ${team.id}`);
	}
}

main().catch(console.error);
