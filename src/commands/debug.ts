import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";
import { logAction } from "../utils/logAction";
import { info } from "../utils/logger";

const debug: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("debug")
		.setDescription("Debugging Tools")
		.setDefaultMemberPermissions(0x8)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("clear")
				.setDescription("Clear the store")
				.addBooleanOption((option) => {
					return option
						.setName("all")
						.setDescription("Clear the entire store")
						.setRequired(true);
				});
		})

		.addSubcommand((subcommand) => {
			return subcommand.setName("view").setDescription("View the store");
		}) as any,
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		logAction(
			`Debug command used by ${interaction.user.tag}`,
			interaction.client
		);

		const perms = await hasPermissions(interaction);

		if (!perms) return;

		// @ts-ignore
		if (interaction.options.getSubcommand() === "clear") {
			// @ts-ignore
			const all: boolean = interaction.options.getBoolean("data");

			if (all) {
				info("Clearing the store");
				global.repository.clearAttendance();
			} else {
				info("Clearing the old store");
				global.repository.clearOldAttendance();
			}

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
