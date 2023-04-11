import { Client, TextChannel } from "discord.js";
import { logError } from "./logger";
import config from "../config";

export const logAction = (action: string, client: Client) => {
	const guild = client.guilds.cache.get(config.guildId);

	const ch = guild.channels.cache.find(
		(c) => c.id === config.logChannelId
	) as TextChannel;

	if (!ch) {
		logError("Channel not found");
		return;
	}

	ch.send("`" + `[${new Date().toUTCString()}]` + "` " + action);
};
