import { ButtonInteraction, CacheType } from "discord.js";
import config from "../config";

const handleAcceptVerify = async (
	interaction: ButtonInteraction<CacheType>
) => {
	await interaction.deferReply({ ephemeral: true });

	const commandData = interaction.customId.split("/");

	const m = interaction.guild.members.cache.get(commandData[1]);

	if (!m) {
		return interaction.followUp({ content: "User not found!" });
	}

	m.roles.add(config.verifyRoleId);

	await interaction.followUp({ content: "User verified!" });
};

export default handleAcceptVerify;
