import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
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

		//interaction.channel.send("Another message before the followup!");

		await interaction.followUp({
			embeds: [card],
		});

		//await interaction.reply("Pong!");
	},
};

export default ping;
