import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";

const ping: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with pong!"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const card = new EmbedBuilder()
			.setTitle("Pong!")
			.setDescription("Pong!");

		const notificationMessage = new EmbedBuilder()
			.setTitle("Confirm Your Attendance")
			.setColor("#256fb8")
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1064867501449695238/1124321585457799200/LPFC_Logo_RBG.jpg"
			)
			.setDescription(
				"You haven't confirmed your attendance yet. Please click the button below to go to the #training-dates channel."
			);

		await interaction.user.send({
			embeds: [notificationMessage],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL(
							"https://discord.com/channels/1064867500711497738/1073596981164904498"
						)
						.setLabel("Training Dates")
						.setEmoji("📅")
				),
			],
		});

		//interaction.channel.send("Another message before the followup!");

		await interaction.followUp({
			embeds: [card],
		});

		//await interaction.reply("Pong!");
	},
};

export default ping;
