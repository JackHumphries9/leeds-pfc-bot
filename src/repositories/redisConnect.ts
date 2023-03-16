import { createClient } from "@redis/client";
import { logError } from "../utils/logger";

export const redisConnect = async () => {
	const RURL = process.env.REDIS_URL;

	if (!RURL) {
		logError("No redis url provided");
		process.exit(1);
	}

	const client = createClient({
		url: RURL,
	});

	client.on("error", (err) => {
		logError("Redis error: ", err);
	});

	await client.connect();

	return client;
};
