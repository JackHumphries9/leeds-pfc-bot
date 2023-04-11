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

	logAction(`Verified ${m.user.tag} (${m.id})`, interaction.client);

	try {
		await m.send("You have been verified in the server!");
	} catch {
		logAction(
			`Verification Failed to send DM to ${m.user.tag}`,
			interaction.client
		);
		return await interaction.followUp({
			content: "Verified user but failed to DM.",
		});
	}

	await interaction.followUp({ content: "User verified!" });
};

export default handleAcceptVerify;
