import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";

const rsvp: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("rsvp")
		.setDefaultMemberPermissions(0x8)
		.setDescription(
			"Shows the training sessions for the week with RSVP options"
		),

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		await interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setTitle("Unused Command")
					.setDescription(
						"This command is a phantom command and is not used."
					)
					.setColor("#4aaace"),
			],
		});
	},
};

export default rsvp;
