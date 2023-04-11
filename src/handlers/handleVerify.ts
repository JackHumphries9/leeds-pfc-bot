import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CacheType,
	EmbedBuilder,
	MessageActionRowComponentBuilder,
	MessageComponentBuilder,
	ModalSubmitInteraction,
	TextChannel,
} from "discord.js";
import config from "../config";
import { logError } from "../utils/logger";

export const handleVerify = async (
	interaction: ModalSubmitInteraction<CacheType>
) => {
	const name = interaction.fields.getTextInputValue("name");
	const team = interaction.fields.getTextInputValue("team");
	const number = interaction.fields.getTextInputValue("number");

	const ch = interaction.client.channels.cache.find(
		(c) => c.id === config.verifyChannelId
	) as TextChannel;

	if (!ch) {
		logError("Channel not found");
		interaction.followUp({
			content: `Looks like we have a problem! Please contact an adminstrator!`,
		});
		return;
	}

	ch.send({
		embeds: [
			new EmbedBuilder()
				.setTitle("Verification")
				.setDescription(
					`Member Account: <@!${interaction.user.id}> (${interaction.user.tag})\n\n**Responses**:\nName: **${name}**\nTeam: **${team}**\nNumber: **${number}**`
				),
		],
		components: [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				[
					new ButtonBuilder()
						.setCustomId("acceptVerify/" + interaction.user.id)
						.setLabel("Accept")
						.setStyle(ButtonStyle.Success),
				]
			),
		],
	});

	interaction.reply({
		content: `Thanks for verifying ${name}! We'll get back to you soon!`,
		ephemeral: true,
	});
};
