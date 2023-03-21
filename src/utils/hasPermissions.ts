import { EmbedBuilder } from "@discordjs/builders";
import {
	APIApplicationCommandInteraction,
	CacheType,
	ColorResolvable,
	CommandInteraction,
	Interaction,
} from "discord.js";
import config from "../config";

export const hasPermissions = (
	interaction: CommandInteraction<CacheType>
): boolean => {
	// @ts-ignore
	if (interaction.member?.roles.findIndex((r) => r === config.adminRoleId)) {
		return true;
	}

	interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setTitle("Error!")
				.setColor(0xff0000)
				.setDescription(
					"You do not have the required permissions to run this command."
				),
		],
	});
	return false;
};
