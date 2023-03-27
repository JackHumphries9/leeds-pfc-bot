import { ButtonInteraction, CacheType, Guild } from "discord.js";
import config from "../config";
import { logAction } from "../utils/logAction";

const handleAcceptVerify = async (
	interaction: ButtonInteraction<CacheType>
) => {
	await interaction.deferReply({ ephemeral: true });

	const commandData = interaction.customId.split("/");

	const m = interaction.guild.members.cache.get(commandData[1]);

	if (!m) {
		return interaction.followUp({ content: "User not found!" });
	}

	try {
		await m.roles.add(config.verifyRoleId);
	} catch {
		return await interaction.followUp({ content: "Failed to add role!" });
	}

	logAction(`Verified ${m.user.tag} (${m.id})`, interaction.guild as any);

	await interaction.followUp({ content: "User verified!" });
};

export default handleAcceptVerify;
