import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";

const debug: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("debug")
		.setDescription("Debugging Tools")
		.setDefaultMemberPermissions(0x20)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("clear")
				.setDescription("Clear the store");
		})
		.addSubcommand((subcommand) => {
			return subcommand.setName("view").setDescription("View the store");
		}) as any,
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		if (
			!interaction.memberPermissions.has("Administrator") ||
			!interaction.memberPermissions.has("ManageGuild")
		) {
			interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("Error!")
						.setColor("#FF0000")
						.setDescription(
							"You do not have the required permissions to run this command."
						),
				],
			});
			return;
		}

		// @ts-ignore
		if (interaction.options.getSubcommand() === "clear") {
			global.repository.clearAttendance();

			const card = new EmbedBuilder()
				.setTitle("Cleared!")
				.setDescription("Cleared the store");

			interaction.followUp({
				embeds: [card],
			});

			return;
		}

		// @ts-ignore
		if (interaction.options.getSubcommand() === "view") {
			const card = new EmbedBuilder().setTitle("Store View")
				.setDescription(`Here is the store:
\`\`\`json\n${JSON.stringify(
				await global.repository.getAllAttendance(),
				null,
				4
			)}\`\`\``);

			interaction.followUp({
				embeds: [card],
			});

			return;
		}

		const card = new EmbedBuilder()
			.setTitle("Not found!")
			.setDescription("Command not found!");

		interaction.followUp({
			embeds: [card],
		});
	},
};

export default debug;
