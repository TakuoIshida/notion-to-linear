import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notionClient = new Client({
	auth: process.env.NOTION_API_KEY,
});

// 指定のteamの未着手・進行中のタスクのみ抽出します。
export const getNotionDatabase = async (
	databaseId: string,
	teamName: string,
) => {
	const pages = await notionClient.databases.query({
		database_id: databaseId,
		filter: {
			and: [
				{
					property: "team",
					select: {
						equals: teamName,
					},
				},
				{
					or: [
						{
							property: "ステータス",
							status: {
								equals: "未着手",
							},
						},
						{
							property: "ステータス",
							status: {
								equals: "進行中",
							},
						},
					],
				},
			],
		},
	});

	return pages;
};
