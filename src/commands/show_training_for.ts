import {
	ColorResolvable,
	CommandInteractionOptionResolver,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";
import { logAction } from "../utils/logAction";
import niceDate from "../utils/niceDate";

const show_training_for: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("show-training-for")
		.setDescription("Shows your training sessions for the week")
		.addRoleOption((option) =>
			option
				.setName("team")
				.setDescription("The team to show training for")
				.setRequired(true)
		),

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const perms = await hasPermissions(interaction);

		if (!perms) return;

		logAction(
			`Show Training For command used by ${interaction.user.tag}`,
			interaction.client
		);

		const teamId = (
			interaction.options as CommandInteractionOptionResolver
		).getRole("team").id;

		if (!global.calendar_cache) {
			const card = new EmbedBuilder()
				.setTitle("Error!")
				.setColor("#FF0000")
				.setDescription(
					"Failed to show the calendar. Please try again later or use the `/refresh-cache` command."
				);

			await interaction.followUp({
				embeds: [card],
			});
			return;
		}

		if (global.calendar_cache.length === 0) {
			const card = new EmbedBuilder()
				.setTitle("No Events Found!")
				.setColor("#4aaace")
				.setDescription(
					"There are no training sessions scheduled for this week."
				);

			await interaction.followUp({
				embeds: [card],
			});
			return;
		}

		const embeds = global.calendar_cache
			.map((event) => {
				let shouldShow = false;
				event.subcalendar_ids.forEach((id) => {
					if (
						config.eventMap[id.toString()].roleId.find(
							(r) => r === teamId.toString()
						)
					) {
						shouldShow = true;
					}
				});

				if (shouldShow === false) {
					return;
				}

				const meta = niceDate(
					new Date(event.start_dt),
					new Date(event.end_dt),
					event.all_day
				);

				return new EmbedBuilder()
					.setColor(
						config.eventMap[event.subcalendar_ids[0]].colour ||
							("#4aaace" as ColorResolvable)
					)
					.setTitle(
						event.title && event.title.length > 0
							? event.title
							: "Untitled Event"
					)
					.setDescription(
						`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
					)
					.setFooter({
						text: `For: ${event.subcalendar_ids
							.map((id) =>
								config.eventMap[id.toString()]
									? config.eventMap[id.toString()].name
									: null
							)
							.filter((i) => i)
							.join(", ")}`,
					});
			})
			.filter((event) => event);

		if (embeds.length === 0) {
			const card = new EmbedBuilder()
				.setTitle("No Events Found!")
				.setColor("#4aaace")
				.setDescription(
					"There are no training sessions scheduled for this week."
				);

			await interaction.followUp({
				embeds: [card],
			});
			return;
		}

		await interaction.followUp({
			embeds: embeds,
		});
	},
};

export default show_training_for;
