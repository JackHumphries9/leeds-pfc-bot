import { Client, TextChannel } from "discord.js";
import { logError } from "./logger";
import config from "../config";

export const logAction = (action: string, client: Client) => {
	const ch = client.channels.cache.find(
		(c) => c.id === config.logChannelId
	) as TextChannel;

	if (!ch) {
		logError("Channel not found");
		return;
	}

	ch.send("`" + `[${new Date().toUTCString()}]` + "` " + action);
};
