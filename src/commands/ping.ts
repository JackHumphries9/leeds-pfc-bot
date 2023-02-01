import { CacheType, Interaction, SlashCommandBuilder } from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";

const ping: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with pong!"),
	execute: async (interaction: any) => {
		await interaction.reply("Pong!");
	},
};

export default ping;
