import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notionClient = new Client({
	auth: process.env.NOTION_API_KEY,
});

export const getNotionDatabase = async (
	databaseId: string,
	teamName: string,
) => {
	console.log(teamName);
	const pages = await notionClient.databases.query({
		database_id: databaseId,
		// filter: {
		// 	property: "team",
		// 	select: {
		// 		equals: "cactus",
		// 	},
		// },
	});

	return pages;
};
