import fs from "fs/promises";
import { Client, Pool } from "pg";

interface IRedisEntry {
	userId: string;
	eventId: string;
	isAttending: boolean;
	createdAt: number;
}

async function readFile(path: string): Promise<IRedisEntry[]> {
	const file = await fs.readFile(path, "utf-8");

	return JSON.parse(file);
}

async function main() {
	const entries = await readFile("./dump.json");

	console.log("Number of entries: " + entries.length);

	const client = new Pool({ connectionString: process.env.DATABASE_URL });
	await client.connect();

	const proms: Promise<any>[] = [];

	entries.forEach((entry, i) => {
		proms.push(
			new Promise<void>((resolve, reject) => {
				console.log("Inserting entry " + i);
				client
					.query(
						"INSERT INTO attendance (user_id, event_id, is_attending, created_at) VALUES ($1, $2, $3, $4)",
						[
							entry.userId,
							entry.eventId,
							entry.isAttending,
							new Date(entry.createdAt),
						]
					)
					.then(() => {
						console.log("Done entry " + i);
						resolve();
					})
					.catch((err) => reject(err));
			})
		);
	});

	await Promise.all(proms);
}

await main();
