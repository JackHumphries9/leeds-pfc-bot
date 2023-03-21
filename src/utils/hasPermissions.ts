import { EmbedBuilder } from "@discordjs/builders";
import {
	APIApplicationCommandInteraction,
	CacheType,
	ColorResolvable,
	CommandInteraction,
	Interaction,
} from "discord.js";
import config from "../config";
import { info } from "./logger";

export const hasPermissions = async (
	interaction: CommandInteraction<CacheType>
): Promise<boolean> => {
	const m = await interaction.guild.members.fetch(interaction.user.id);

	if (m.roles.cache.find((r) => r.id === config.adminRoleId) === undefined) {
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
	}

	return true;
};
