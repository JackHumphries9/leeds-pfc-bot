import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { debug } from "../utils/logger";
import niceDate from "../utils/niceDate";

const my_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("my-training")
		.setDescription("Shows your training sessions for the week"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		if (!global.calendar_cache) {
			const card = new EmbedBuilder()
				.setTitle("Error!")
				.setColor("#FF0000")
				.setDescription(
					"Failed to show the calendar. Please try again later or use the `/refresh-cache` command."
				);

			interaction.followUp({
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

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		const embeds = global.calendar_cache
			.map((event) => {
				var shouldShow = false;

				event.subcalendar_ids.forEach((id) => {
					if (
						//@ts-ignore
						interaction.member.roles.cache.find(
							(role) =>
								role.id.toString() ===
								config.teamMap[id.toString()].roleId
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
						config.teamMap[event.subcalendar_ids[0]].colour ||
							("#4aaace" as ColorResolvable)
					)
					.setTitle(event.title)
					.setDescription(
						`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
					)
					.setFooter({
						text: `For: ${event.subcalendar_ids
							.map((id) =>
								config.teamMap[id.toString()]
									? config.teamMap[id.toString()].name
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

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		interaction.followUp({
			embeds: embeds,
		});
	},
};

export default my_training;
