import { Client, TextChannel } from "discord.js";
import { info, logError } from "./logger";
import config from "../config";

export const logAction = (action: string, client: Client, tr?: boolean) => {
	const guild = client.guilds.cache.get(config.guildId);

	if (!guild && !tr) {
		client.guilds.fetch().then(() => {
			info("Attempting to log action again and refresh guilds cache");
			logAction(action, client, true);
		});
		return;
	}

	if (tr) {
		logError("Guild not found");
		return;
	}

	const ch = guild.channels.cache.find(
		(c) => c.id === config.logChannelId
	) as TextChannel;

	if (!ch) {
		logError("Channel not found");
		return;
	}

	ch.send("`" + `[${new Date().toUTCString()}]` + "` " + action);
};
